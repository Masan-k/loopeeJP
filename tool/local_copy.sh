#!/bin/bash
APP_NAME=loopeeJP
sudo rm -r /var/www/my_domain/$APP_NAME/*
sudo cp *.html /var/www/my_domain/$APP_NAME
sudo cp *.js /var/www/my_domain/$APP_NAME
sudo cp *.json /var/www/my_domain/$APP_NAME
sudo cp -r img /var/www/my_domain/$APP_NAME
