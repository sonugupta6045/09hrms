# Setting Up MongoDB for Your HR Management System

This guide will walk you through the process of setting up a MongoDB database for your HR Management System.

## Step 1: Create a MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Verify your email address if required.

## Step 2: Create a New Cluster

1. From the MongoDB Atlas dashboard, click on "Build a Cluster" or "Create".
2. Choose the "Shared" (free) option for development purposes.
3. Select your preferred cloud provider and region.
4. Click "Create Cluster" to create your database cluster.

## Step 3: Set Up Database Access

1. In the left sidebar, click on "Database Access" under the Security section.
2. Click "Add New Database User".
3. Choose a username and a secure password.
4. For database user privileges, select "Read and write to any database".
5. Click "Add User" to create the database user.

## Step 4: Set Up Network Access

1. In the left sidebar, click on "Network Access" under the Security section.
2. Click "Add IP Address".
3. To allow access from anywhere (not recommended for production), click "Allow Access from Anywhere".
4. For more security, add your specific IP address or IP range.
5. Click "Confirm" to save the network access rule.

## Step 5: Get Your Connection String

1. In the left sidebar, click on "Database" under the Deployment section.
2. Click "Connect" for your cluster.
3. Choose "Connect your application".
4. Copy the connection string. It should look something like this:

