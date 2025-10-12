#!/bin/bash

# Test login API via shell script
echo "=== Testing Login API via Shell Script ==="
echo "URL: http://localhost:3520/api/auth/login"
echo "Credentials: dev@sol.com.vn / adminuser"
echo ""

# Make the API call
response=$(curl -X POST \
  "http://localhost:3520/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@sol.com.vn","password":"adminuser"}' \
  -v \
  -c /tmp/cookies.txt \
  2>/tmp/curl_debug.txt)

echo "=== HTTP Response ==="
echo "$response"
echo ""

echo "=== HTTP Status Code ==="
echo "Status: $(echo "$response" | jq -r '.success // "error"' 2>/dev/null || echo "Failed to parse JSON")"
echo ""

echo "=== Cookies Received ==="
if [ -f /tmp/cookies.txt ]; then
    echo "Cookie file contents:"
    cat /tmp/cookies.txt
    echo ""
    echo "Directus cookies found:"
    grep "directus_" /tmp/cookies.txt || echo "No directus cookies found"
else
    echo "No cookie file created"
fi
echo ""

echo "=== cURL Debug Output ==="
if [ -f /tmp/curl_debug.txt ]; then
    echo "cURL verbose output:"
    cat /tmp/curl_debug.txt
fi

# Clean up
rm -f /tmp/cookies.txt /tmp/curl_debug.txt

echo ""
echo "=== Test Complete ==="