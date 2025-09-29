#!/bin/bash

i=1
while true; do
  curl -s -X POST http://localhost:3000/users \
       -H "Content-Type: application/json" \
       -d "{\"name\":\"User_$i\",\"ts\":\"$(date +%s)\"}" \
       && echo " ✅ Inserted User_$i" \
       || echo " ❌ Failed User_$i"
  i=$((i+1))
  sleep 2
done

