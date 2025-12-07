#!/usr/bin/env tsx
/**
 * Firebase Configuration Verification Script
 * 
 * This script helps diagnose common Firebase configuration issues:
 * - Validates environment variables
 * - Tests Firebase SDK initialization
 * - Checks Firestore connectivity
 * - Verifies security rules deployment
 * 
 * Usage:
 *   npx tsx script/verify-firebase.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as fs from 'fs';
import * as path from 'path';

// Simple .env file parser (avoids adding dotenv dependency)
function loadEnvFile() {
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
      console.log('⚠️  No .env file found. Using environment variables if available.\n');
      return;
    }
    
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').trim();
      
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    console.log('⚠️  Could not read .env file. Using environment variables if available.\n');
  }
}

// Load environment variables
loadEnvFile();

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN' | 'SKIP';
  message: string;
  details?: string;
}

const results: TestResult[] = [];

function printResult(result: TestResult) {
  const symbols = {
    PASS: '✅',
    FAIL: '❌',
    WARN: '⚠️',
    SKIP: '⏭️'
  };
  
  console.log(`${symbols[result.status]} ${result.name}`);
  console.log(`   ${result.message}`);
  if (result.details) {
    console.log(`   ${result.details}`);
  }
  console.log();
}

function printSummary() {
  console.log('\n' + '='.repeat(80));
  console.log('VERIFICATION SUMMARY');
  console.log('='.repeat(80));
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const warnings = results.filter(r => r.status === 'WARN').length;
  const skipped = results.filter(r => r.status === 'SKIP').length;
  
  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log();
  
  if (failed > 0) {
    console.log('❌ VERIFICATION FAILED');
    console.log('See FIRESTORE_TROUBLESHOOTING.md for solutions to common issues.');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('⚠️  VERIFICATION PASSED WITH WARNINGS');
    console.log('Review warnings above to ensure optimal configuration.');
    process.exit(0);
  } else {
    console.log('✅ ALL CHECKS PASSED');
    console.log('Firebase configuration is correct and Firestore is accessible.');
    process.exit(0);
  }
}

async function verifyEnvironmentVariables(): Promise<void> {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_APP_ID'
  ];
  
  const missing: string[] = [];
  const present: string[] = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    } else {
      present.push(varName);
    }
  }
  
  if (missing.length > 0) {
    results.push({
      name: 'Environment Variables',
      status: 'FAIL',
      message: `Missing ${missing.length} required environment variables`,
      details: `Missing: ${missing.join(', ')}\nCreate a .env file with these variables (see .env.example)`
    });
  } else {
    results.push({
      name: 'Environment Variables',
      status: 'PASS',
      message: 'All required Firebase environment variables are set'
    });
  }
}

async function verifyFirebaseConfig(): Promise<{ app: any; db: any; auth: any } | null> {
  try {
    const firebaseConfig = {
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      appId: process.env.VITE_FIREBASE_APP_ID
    };
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    
    results.push({
      name: 'Firebase SDK Initialization',
      status: 'PASS',
      message: `Successfully initialized Firebase SDK for project: ${firebaseConfig.projectId}`
    });
    
    return { app, db, auth };
  } catch (error: any) {
    results.push({
      name: 'Firebase SDK Initialization',
      status: 'FAIL',
      message: 'Failed to initialize Firebase SDK',
      details: `Error: ${error.message}\nVerify your Firebase configuration values in .env`
    });
    return null;
  }
}

async function verifyFirestoreRead(db: any): Promise<void> {
  try {
    // Try to read from the chat collection
    const chatRef = collection(db, 'chat');
    const snapshot = await getDocs(chatRef);
    
    results.push({
      name: 'Firestore Read Permission',
      status: 'PASS',
      message: `Successfully read from Firestore (found ${snapshot.size} documents in 'chat' collection)`
    });
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      results.push({
        name: 'Firestore Read Permission',
        status: 'FAIL',
        message: 'Permission denied when reading from Firestore',
        details: 'Security rules are not properly deployed. Run: firebase deploy --only firestore:rules'
      });
    } else if (error.code === 'unavailable') {
      results.push({
        name: 'Firestore Read Permission',
        status: 'FAIL',
        message: 'Cannot connect to Firestore',
        details: 'Check internet connection and verify project ID is correct'
      });
    } else {
      results.push({
        name: 'Firestore Read Permission',
        status: 'FAIL',
        message: 'Failed to read from Firestore',
        details: `Error: ${error.message} (${error.code})`
      });
    }
  }
}

async function verifyFirestoreWrite(db: any): Promise<void> {
  try {
    // Try to write a test document
    const testRef = collection(db, 'chat');
    const testDoc = await addDoc(testRef, {
      userId: 'verification-script',
      displayName: 'Verification Script',
      photoUrl: '',
      text: 'Test message from verification script',
      isCommand: false,
      timestamp: new Date()
    });
    
    // Clean up - delete the test document
    await deleteDoc(doc(db, 'chat', testDoc.id));
    
    results.push({
      name: 'Firestore Write Permission',
      status: 'PASS',
      message: 'Successfully wrote to and deleted from Firestore'
    });
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      results.push({
        name: 'Firestore Write Permission',
        status: 'FAIL',
        message: 'Permission denied when writing to Firestore',
        details: 'Security rules are not properly deployed. Run: firebase deploy --only firestore:rules'
      });
    } else {
      results.push({
        name: 'Firestore Write Permission',
        status: 'FAIL',
        message: 'Failed to write to Firestore',
        details: `Error: ${error.message} (${error.code})`
      });
    }
  }
}

async function verifyProjectId(): Promise<void> {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  const expectedProjectId = 'phasmophobia-hq';
  
  if (projectId === expectedProjectId) {
    results.push({
      name: 'Project ID',
      status: 'PASS',
      message: `Project ID matches expected value: ${projectId}`
    });
  } else {
    results.push({
      name: 'Project ID',
      status: 'WARN',
      message: `Project ID is '${projectId}' (expected '${expectedProjectId}')`,
      details: 'Using a different project ID is OK if you have your own Firebase project'
    });
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║           Firebase Configuration Verification Script                       ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝');
  console.log();
  
  // Test 1: Verify environment variables
  await verifyEnvironmentVariables();
  printResult(results[results.length - 1]);
  
  // If env vars are missing, stop here
  if (results[results.length - 1].status === 'FAIL') {
    printSummary();
    return;
  }
  
  // Test 2: Verify project ID
  await verifyProjectId();
  printResult(results[results.length - 1]);
  
  // Test 3: Initialize Firebase
  const firebase = await verifyFirebaseConfig();
  printResult(results[results.length - 1]);
  
  // If Firebase init failed, stop here
  if (!firebase) {
    printSummary();
    return;
  }
  
  // Test 4: Test Firestore read
  await verifyFirestoreRead(firebase.db);
  printResult(results[results.length - 1]);
  
  // Test 5: Test Firestore write
  await verifyFirestoreWrite(firebase.db);
  printResult(results[results.length - 1]);
  
  // Print summary
  printSummary();
}

// Run verification
main().catch(error => {
  console.error('Unexpected error during verification:', error);
  process.exit(1);
});
