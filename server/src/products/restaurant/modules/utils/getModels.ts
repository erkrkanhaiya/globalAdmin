/**
 * Utility to get models using product connection
 * This ensures all models use the product's database connection
 */

import { getUserModel } from '@/products/restaurant/modules/auth/models/User.js'
// Import other model getters as needed
// import { getAgentModel } from '@/modules/agent/models/Agent.js'
// etc.

export const getProductModels = (productConnection: any) => {
  return {
    User: getUserModel(productConnection),
    // Add other models here
    // Agent: getAgentModel(productConnection),
    // Property: getPropertyModel(productConnection),
  }
}
