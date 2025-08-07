import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import axios from 'axios';

// Force this API route to be dynamic (not cached)
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const ownerName = formData.get('ownerName') as string;
    const ownerEmail = formData.get('ownerEmail') as string;
    const siteName = formData.get('siteName') as string;
    const siteSubtitle = formData.get('siteSubtitle') as string;
    const bio = formData.get('bio') as string;
    const avatarPhoto = formData.get('avatarPhoto') as File | null;

    // Validate required fields
    if (!ownerName || !siteName) {
      return NextResponse.json(
        { error: 'Owner name and site name are required' },
        { status: 400 }
      );
    }

    // Server-side environment variables (secure)
    const API_KEY = process.env.CONTENTSTACK_API_KEY;
    const MGMT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN;
    const API_HOST = process.env.CONTENTSTACK_API_HOST || 'api.contentstack.io';
    const ENVIRONMENT = process.env.CONTENTSTACK_ENVIRONMENT || 'production';
    const BASE_URL = `https://${API_HOST}`;

    if (!API_KEY || !MGMT_TOKEN) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create the site configuration entry
    const headers = {
      'api_key': API_KEY,
      'authorization': MGMT_TOKEN,
      'Content-Type': 'application/json'
    };

    // Check if site configuration already exists
    const checkResponse = await axios.get(
      `${BASE_URL}/v3/content_types/site_configuration/entries`,
      { headers }
    );

    if (checkResponse.data.entries && checkResponse.data.entries.length > 0) {
      return NextResponse.json(
        { error: 'Setup has already been completed' },
        { status: 400 }
      );
    }

    // Upload avatar photo if provided
    let avatarPhotoData = null;
    if (avatarPhoto && avatarPhoto.size > 0) {
      try {
        console.log('Uploading avatar photo to Contentstack...');
        
        // Create FormData for asset upload
        const assetFormData = new FormData();
        assetFormData.append('asset[upload]', avatarPhoto);
        assetFormData.append('asset[title]', `${ownerName} Avatar`);
        assetFormData.append('asset[description]', `Profile photo for ${ownerName}`);

        const uploadResponse = await axios.post(
          `${BASE_URL}/v3/assets`,
          assetFormData,
          {
            headers: {
              'api_key': API_KEY,
              'authorization': MGMT_TOKEN,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (uploadResponse.data?.asset) {
          const asset = uploadResponse.data.asset;
          console.log('Full asset response:', JSON.stringify(asset, null, 2));
          
          // Try the UID-only format first (this often works for file fields)
          avatarPhotoData = asset.uid;
          
          console.log('Avatar photo uploaded successfully:', asset.url);
          console.log('Using asset UID:', avatarPhotoData);
        }
      } catch (uploadError) {
        console.warn('Failed to upload avatar photo:', uploadError);
        // Continue without photo if upload fails
      }
    }

    // Create the new site configuration entry
    const createData = {
      entry: {
        title: 'Site Configuration',
        site_name: siteName,
        site_subtitle: siteSubtitle || '',
        owner_name: ownerName,
        owner_email: ownerEmail || '',
        bio: bio || '',
        ...(avatarPhotoData && { avatar_photo: avatarPhotoData })
      }
    };

    console.log('Creating site configuration with data:', JSON.stringify(createData, null, 2));

    let createResponse;
    try {
      createResponse = await axios.post(
        `${BASE_URL}/v3/content_types/site_configuration/entries`,
        createData,
        { headers }
      );
    } catch (error: unknown) {
      const axiosError = error as { 
        response?: { 
          status?: number; 
          statusText?: string; 
          data?: unknown; 
        }; 
        config?: { 
          url?: string; 
          method?: string; 
        }; 
      };
      console.error('Contentstack API Error Details:', {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        url: axiosError.config?.url,
        method: axiosError.config?.method
      });
      
      // If we have an avatar photo and the request failed, try alternative formats
      if (avatarPhotoData && axiosError.response?.status === 422) {
        console.log('First photo format failed, trying alternatives...');
        
        console.log('UID format failed, trying alternative formats...');
        
        // Since we have the asset UID already, let's try different formats
        const assetUid = avatarPhotoData;
        
        // Try format 2: Array with UID
        console.log('Trying array format...');
        const createDataFormat2 = {
          entry: {
            title: 'Site Configuration',
            site_name: siteName,
            site_subtitle: siteSubtitle || '',
            owner_name: ownerName,
            owner_email: ownerEmail || '',
            bio: bio || '',
            avatar_photo: [assetUid]  // Array format
          }
        };
        
        try {
          createResponse = await axios.post(
            `${BASE_URL}/v3/content_types/site_configuration/entries`,
            createDataFormat2,
            { headers }
          );
          console.log('Successfully created entry with array format!');
        } catch {
          console.log('Array format also failed, trying simple object...');
          
          // Try format 3: Simple object with just UID
          const createDataFormat3 = {
            entry: {
              title: 'Site Configuration',
              site_name: siteName,
              site_subtitle: siteSubtitle || '',
              owner_name: ownerName,
              owner_email: ownerEmail || '',
              bio: bio || '',
              avatar_photo: { uid: assetUid }
            }
          };
          
          try {
            createResponse = await axios.post(
              `${BASE_URL}/v3/content_types/site_configuration/entries`,
              createDataFormat3,
              { headers }
            );
            console.log('Successfully created entry with simple object format!');
          } catch {
            console.log('All photo formats failed, creating without photo...');
            const createDataWithoutPhoto = {
              entry: {
                title: 'Site Configuration',
                site_name: siteName,
                site_subtitle: siteSubtitle || '',
                owner_name: ownerName,
                owner_email: ownerEmail || '',
                bio: bio || ''
              }
            };
            
            createResponse = await axios.post(
              `${BASE_URL}/v3/content_types/site_configuration/entries`,
              createDataWithoutPhoto,
              { headers }
            );
            
            console.log('Successfully created entry without photo. Photo format issue confirmed.');
          }
        }
      } else {
        throw error;
      }
    }

    const entryUid = createResponse.data.entry.uid;

    // Add a brief delay to ensure asset attachment has propagated
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Publish the new entry so it's available via delivery API
    try {
      const publishData = {
        entry: {
          environments: [ENVIRONMENT || 'production'],
          locales: ['en-us']
        },
        // Include references to publish associated assets
        publish_with_reference: true
      };

      await axios.post(
        `${BASE_URL}/v3/content_types/site_configuration/entries/${entryUid}/publish`,
        publishData,
        { headers }
      );
      
      console.log('Site configuration entry published successfully with references');

    } catch (publishError) {
      console.warn('Failed to publish entry, but creation succeeded:', publishError);
      // Don't fail the request if publish fails, the creation is what matters
    }

    // Revalidate pages to clear any cached data
    revalidatePath('/', 'layout'); // Revalidate layout to update metadata
    revalidatePath('/');
    revalidatePath('/setup');
    
    const response = NextResponse.json({ 
      success: true,
      timestamp: Date.now()
    });

    // Add cache-busting headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Setup API error:', error);
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    );
  }
}