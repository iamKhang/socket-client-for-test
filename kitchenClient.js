const { io } = require("socket.io-client");

// Kết nối đến WebSocket server
const socket = io("http://localhost:3000", {
  transports: ["websocket"], // Sử dụng WebSocket
});

// Lắng nghe sự kiện kết nối
socket.on("connect", () => {
    console.log("Kitchen connected to server with ID:", socket.id);
  
    // Đăng ký role là 'kitchen'
    socket.emit("register", "kitchen");
  });
  
// Lắng nghe sự kiện 'newOrder' từ server
socket.on("newOrder", (order) => {
  console.log("New order received in kitchen:", order);

  // Giả lập xử lý đơn hàng và phản hồi lại server
  const updatedOrder = {
    ...order,
    status: "In Progress", // Đánh dấu trạng thái
    kitchenId: socket.id,
  };

  console.log("Processing order:", updatedOrder);

  // Gửi sự kiện 'orderUpdate' về server
  socket.emit("orderUpdate", updatedOrder);
});

// Lắng nghe sự kiện ngắt kết nối
socket.on("disconnect", () => {
  console.log("Kitchen disconnected from server");
});
