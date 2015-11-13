#!/bin/bash
#
# This script deploys the medical interchange site.

AWS_KEY='/etc/starfleet/starfleet.pem'
ssh -o StrictHostKeyChecking=no -i $AWS_KEY ubuntu@starfleet.stormbeard.net "
  cd /home/ubuntu/medical-interchange;
  git fetch;
  git reset --hard origin/master;
  npm install --production;
  sudo forever restartall;
"
