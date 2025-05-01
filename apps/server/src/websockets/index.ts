// import { WebSocketServer } from "./webSocketServer";


// const initializeWebSocketServer = (port: number) => {
//     const wss = new WebSocketServer(port);
    
//     // Handle process termination
//     process.on('SIGTERM', () => {
//         console.log('SIGTERM received. Closing WebSocket server...');
//         wss.close();
//     });
    
//     return wss;
// };

// export default initializeWebSocketServer;