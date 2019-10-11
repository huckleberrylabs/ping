import { UUID } from "@huckleberryai/core";

// for endpoint "/tracking_id.js"
// include <script type="text/javascript" src="/tracking_id.js"></script> in web page
export const CacheBasedTracking = () => {
  /* 
    last_modified set to unix 0 time
    response['Content-Type'] = 'text/javascript'
    cache_control private
   */
  return `const MY_UNIQUE_TRACKING_ID = '${UUID()}';`;
};
