import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    // Get all environment variables we need
    const API_KEY = process.env.CONTENTSTACK_API_KEY;
    const DELIVERY_TOKEN = process.env.CONTENTSTACK_DELIVERY_TOKEN;
    const MGMT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN;
    const API_HOST = process.env.CONTENTSTACK_API_HOST || 'api.contentstack.io';
    const CDN = process.env.CONTENTSTACK_CDN || 'cdn.contentstack.io';
    const ENVIRONMENT = process.env.CONTENTSTACK_ENVIRONMENT || 'production';
    
    const debug = {
      environment_vars: {
        API_KEY: !!API_KEY,
        DELIVERY_TOKEN: !!DELIVERY_TOKEN,
        MGMT_TOKEN: !!MGMT_TOKEN,
        has_api_host: !!API_HOST,
        has_cdn: !!CDN,
        has_environment: !!ENVIRONMENT
      },
      site_configuration: null as unknown,
      error: null as string | null
    };

    // Try to fetch site configuration using delivery API
    if (API_KEY && DELIVERY_TOKEN) {
      try {
        const response = await fetch(
          `https://${CDN}/v3/content_types/site_configuration/entries?environment=${ENVIRONMENT}`,
          {
            headers: {
              'api_key': API_KEY,
              'access_token': DELIVERY_TOKEN,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          debug.site_configuration = data;
        } else {
          debug.error = `Delivery API failed: ${response.status} ${response.statusText}`;
        }
      } catch (deliveryError) {
        debug.error = `Delivery API error: ${(deliveryError as Error).message}`;
      }
    }

    // If delivery API failed, try management API
    if (!debug.site_configuration && API_KEY && MGMT_TOKEN) {
      try {
        const mgmtResponse = await axios.get(
          `https://${API_HOST}/v3/content_types/site_configuration/entries`,
          {
            headers: {
              'api_key': API_KEY,
              'authorization': MGMT_TOKEN,
              'Content-Type': 'application/json'
            }
          }
        );
        
        debug.site_configuration = mgmtResponse.data;
        debug.error = null; // Clear previous error if management API works
      } catch (mgmtError) {
        debug.error = `Management API error: ${(mgmtError as Error).message}`;
      }
    }

    return NextResponse.json(debug, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Debug route error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}