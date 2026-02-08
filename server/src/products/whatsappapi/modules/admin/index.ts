// Admin Module Exports
export * from './controllers/adminController.js"
export * from './controllers/propertyController.js"
// Export agentController with renamed createAgent to avoid conflict
export {
  getAllAgents,
  getAgentById,
  createAgent as createAgentDocument,
  updateAgent,
  deleteAgent,
} from './controllers/agentController.js"
export * from './controllers/paymentController.js"
export * from './controllers/auctionController.js"
export * from './controllers/supportController.js"
export * from './controllers/dashboardController.js"
export { default as adminRoutes } from './routes/adminRoutes.js"

