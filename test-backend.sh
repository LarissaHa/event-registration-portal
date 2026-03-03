#!/bin/bash
echo "Testing Event Service..."
curl -s http://localhost:4004/odata/v4/event/Events | jq -r '.value | length'
echo "Testing SuccessFactors Mock Service..."
curl -s http://localhost:4004/odata/v4/success-factors-mock/Employees | jq -r '.value | length'
