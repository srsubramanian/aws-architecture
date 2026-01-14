/**
 * Security service exports
 */

import React from 'react';
import { AWSService } from '../shared';
import type { AWSServiceBaseProps } from '../../../types';

// WAF Component
export type WAFProps = Omit<AWSServiceBaseProps, 'type'> & {
  webAclName?: string;
  ruleCount?: number;
  scope?: 'REGIONAL' | 'CLOUDFRONT';
};

export const WAF: React.FC<WAFProps> = ({ webAclName, ruleCount, scope, metadata, ...props }) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'AWS WAF',
    custom: {
      ...metadata?.custom,
      ...(webAclName && { 'Web ACL': webAclName }),
      ...(ruleCount && { Rules: ruleCount }),
      ...(scope && { Scope: scope }),
    },
  };
  return <AWSService type="waf" metadata={enhancedMetadata} {...props} />;
};

// Shield Component
export type ShieldProps = Omit<AWSServiceBaseProps, 'type'> & {
  protectionLevel?: 'Standard' | 'Advanced';
  protectedResources?: number;
};

export const Shield: React.FC<ShieldProps> = ({ protectionLevel, protectedResources, metadata, ...props }) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'AWS Shield',
    custom: {
      ...metadata?.custom,
      ...(protectionLevel && { Level: protectionLevel }),
      ...(protectedResources && { 'Protected Resources': protectedResources }),
    },
  };
  return <AWSService type="shield" metadata={enhancedMetadata} {...props} />;
};

// Secrets Manager Component
export type SecretsManagerProps = Omit<AWSServiceBaseProps, 'type'> & {
  secretName?: string;
  rotationEnabled?: boolean;
  rotationDays?: number;
};

export const SecretsManager: React.FC<SecretsManagerProps> = ({ secretName, rotationEnabled, rotationDays, metadata, ...props }) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'AWS Secrets Manager',
    custom: {
      ...metadata?.custom,
      ...(secretName && { Secret: secretName }),
      ...(rotationEnabled !== undefined && { Rotation: rotationEnabled ? 'Enabled' : 'Disabled' }),
      ...(rotationDays && { 'Rotation Days': rotationDays }),
    },
  };
  return <AWSService type="secrets-manager" metadata={enhancedMetadata} {...props} />;
};

// KMS Component
export type KMSProps = Omit<AWSServiceBaseProps, 'type'> & {
  keyId?: string;
  keyType?: 'SYMMETRIC_DEFAULT' | 'RSA_2048' | 'RSA_4096' | 'ECC_NIST_P256';
  keyUsage?: 'ENCRYPT_DECRYPT' | 'SIGN_VERIFY';
};

export const KMS: React.FC<KMSProps> = ({ keyId, keyType, keyUsage, metadata, ...props }) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'AWS KMS',
    custom: {
      ...metadata?.custom,
      ...(keyId && { 'Key ID': keyId }),
      ...(keyType && { Type: keyType }),
      ...(keyUsage && { Usage: keyUsage }),
    },
  };
  return <AWSService type="kms" metadata={enhancedMetadata} {...props} />;
};

// Cognito Component
export type CognitoProps = Omit<AWSServiceBaseProps, 'type'> & {
  userPoolName?: string;
  userCount?: number;
  mfaEnabled?: boolean;
};

export const Cognito: React.FC<CognitoProps> = ({ userPoolName, userCount, mfaEnabled, metadata, ...props }) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon Cognito',
    custom: {
      ...metadata?.custom,
      ...(userPoolName && { 'User Pool': userPoolName }),
      ...(userCount && { Users: userCount }),
      ...(mfaEnabled !== undefined && { MFA: mfaEnabled ? 'Enabled' : 'Disabled' }),
    },
  };
  return <AWSService type="cognito" metadata={enhancedMetadata} {...props} />;
};
