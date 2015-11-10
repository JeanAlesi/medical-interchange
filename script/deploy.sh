#!/bin/bash
#
# This script deploys the medical interchange site.

AWS_KEY='/etc/starfleet/starfleet.pem'
ssh -o StrictHostKeyChecking=no -i $AWS_KEY ubuntu@starfleet.stormbeard.net "
  cd /home/ubuntu/medical-interchange;
  git pull;
  npm install --production;
  sudo forever restartall;
"
