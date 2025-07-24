/**
 * @file Rigger Ecosystem Real-time Notifications System
 * @author ChaseWhiteRabbit NGO
 * @description Enterprise-grade notification system with Supabase real-time capabilities
 * Ethics-first design respecting data privacy and user choices
 */

import { RealtimeClient } from './realtime/RealtimeClient.js';
import { NotificationManager } from './core/NotificationManager.js';
import { SupabaseNotificationProvider } from './providers/SupabaseProvider.js';
import { WebSocketProvider } from './providers/WebSocketProvider.js';
import { PushNotificationProvider } from './providers/PushProvider.js';
import { PrivacyManager } from './privacy/PrivacyManager.js';
import { NotificationTypes } from './types/NotificationTypes.js';

/**
 * Main notification system class
 * Provides unified interface for all notification operations
 */
export class RiggerNotificationSystem {
  constructor(config = {}) {
    this.config = {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
      enableRealtime: true,
      enablePush: false,
      enablePrivacyMode: true,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config
    };

    this.privacyManager = new PrivacyManager(this.config);
    this.notificationManager = new NotificationManager(this.config);
    this.realtimeClient = null;
    this.providers = new Map();
    
    this.isInitialized = false;
    this.listeners = new Map();
  }

  /**
   * Initialize the notification system
   */
  async initialize() {
    try {
      console.log('🚀 Initializing Rigger Notification System...');
      
      // Initialize privacy manager first
      await this.privacyManager.initialize();
      
      // Initialize Supabase realtime if enabled
      if (this.config.enableRealtime && this.config.supabaseUrl) {
        const supabaseProvider = new SupabaseNotificationProvider({
          url: this.config.supabaseUrl,
          key: this.config.supabaseKey,
          privacyManager: this.privacyManager
        });
        
        this.providers.set('supabase', supabaseProvider);
        await supabaseProvider.initialize();
        
        this.realtimeClient = new RealtimeClient(supabaseProvider);
        await this.realtimeClient.initialize();
      }

      // Initialize WebSocket provider as fallback
      const wsProvider = new WebSocketProvider({
        privacyManager: this.privacyManager
      });
      this.providers.set('websocket', wsProvider);

      // Initialize push notifications if enabled
      if (this.config.enablePush) {
        const pushProvider = new PushNotificationProvider({
          privacyManager: this.privacyManager
        });
        this.providers.set('push', pushProvider);
        await pushProvider.initialize();
      }

      // Initialize notification manager
      await this.notificationManager.initialize(this.providers);

      this.isInitialized = true;
      console.log('✅ Rigger Notification System initialized successfully');
      
      return this;
    } catch (error) {
      console.error('❌ Failed to initialize notification system:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time notifications for a specific channel
   */
  async subscribe(channelName, userId, userType, callback) {
    if (!this.isInitialized) {
      throw new Error('Notification system not initialized. Call initialize() first.');
    }

    // Check privacy permissions
    const hasPermission = await this.privacyManager.checkPermission(userId, 'notifications', channelName);
    if (!hasPermission) {
      console.warn(`User ${userId} denied permission for ${channelName} notifications`);
      return null;
    }

    const subscriptionId = `${channelName}_${userId}_${Date.now()}`;
    
    try {
      // Subscribe through realtime client
      if (this.realtimeClient) {
        await this.realtimeClient.subscribe(channelName, userId, userType, (notification) => {
          this.handleNotification(notification, callback, userId);
        });
      }

      // Store subscription for management
      this.listeners.set(subscriptionId, {
        channelName,
        userId,
        userType,
        callback,
        timestamp: Date.now()
      });

      console.log(`✅ Subscribed to ${channelName} for user ${userId}`);
      return subscriptionId;
      
    } catch (error) {
      console.error(`❌ Failed to subscribe to ${channelName}:`, error);
      throw error;
    }
  }

  /**
   * Handle incoming notifications with privacy and ethics checks
   */
  async handleNotification(notification, callback, userId) {
    try {
      // Privacy check
      const isAllowed = await this.privacyManager.isNotificationAllowed(userId, notification);
      if (!isAllowed) {
        console.log(`🔒 Notification blocked by privacy settings for user ${userId}`);
        return;
      }

      // Rate limiting
      const isRateLimited = await this.notificationManager.isRateLimited(userId, notification.type);
      if (isRateLimited) {
        console.log(`⏱️ Notification rate limited for user ${userId}`);
        return;
      }

      // Process notification
      const processedNotification = await this.notificationManager.processNotification(notification);
      
      // Execute callback
      if (callback && typeof callback === 'function') {
        callback(processedNotification);
      }

      // Log for audit trail
      await this.notificationManager.logNotification(userId, processedNotification);
      
    } catch (error) {
      console.error('❌ Error handling notification:', error);
    }
  }

  /**
   * Send notification to specific user or group
   */
  async sendNotification(notification) {
    if (!this.isInitialized) {
      throw new Error('Notification system not initialized');
    }

    try {
      return await this.notificationManager.sendNotification(notification);
    } catch (error) {
      console.error('❌ Failed to send notification:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from notifications
   */
  async unsubscribe(subscriptionId) {
    if (!subscriptionId || !this.listeners.has(subscriptionId)) {
      console.warn(`No subscription found for ID: ${subscriptionId}`);
      return false;
    }

    try {
      const subscription = this.listeners.get(subscriptionId);
      
      if (this.realtimeClient) {
        await this.realtimeClient.unsubscribe(subscription.channelName, subscription.userId);
      }

      this.listeners.delete(subscriptionId);
      console.log(`✅ Unsubscribed from ${subscription.channelName}`);
      return true;
      
    } catch (error) {
      console.error('❌ Failed to unsubscribe:', error);
      return false;
    }
  }

  /**
   * Update user privacy preferences
   */
  async updatePrivacySettings(userId, settings) {
    try {
      return await this.privacyManager.updateUserSettings(userId, settings);
    } catch (error) {
      console.error('❌ Failed to update privacy settings:', error);
      throw error;
    }
  }

  /**
   * Get notification history for user
   */
  async getNotificationHistory(userId, options = {}) {
    try {
      return await this.notificationManager.getHistory(userId, options);
    } catch (error) {
      console.error('❌ Failed to get notification history:', error);
      throw error;
    }
  }

  /**
   * Cleanup and disconnect
   */
  async disconnect() {
    try {
      console.log('🔌 Disconnecting notification system...');
      
      // Unsubscribe from all channels
      for (const [subscriptionId] of this.listeners) {
        await this.unsubscribe(subscriptionId);
      }

      // Disconnect realtime client
      if (this.realtimeClient) {
        await this.realtimeClient.disconnect();
      }

      // Cleanup providers
      for (const [name, provider] of this.providers) {
        if (provider.disconnect) {
          await provider.disconnect();
        }
      }

      this.isInitialized = false;
      console.log('✅ Notification system disconnected');
      
    } catch (error) {
      console.error('❌ Error during disconnect:', error);
    }
  }
}

// Export notification types and utilities
export { NotificationTypes };
export * from './types/index.js';
export * from './utils/index.js';

// Create singleton instance for easy access
let notificationSystem = null;

export const createNotificationSystem = (config) => {
  if (!notificationSystem) {
    notificationSystem = new RiggerNotificationSystem(config);
  }
  return notificationSystem;
};

export const getNotificationSystem = () => {
  if (!notificationSystem) {
    throw new Error('Notification system not created. Call createNotificationSystem() first.');
  }
  return notificationSystem;
};

export default RiggerNotificationSystem;
