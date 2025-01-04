const { io } = require("socket.io-client");
const readline = require("readline");

// Kết nối đến WebSocket server
const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

// Tạo interface để đọc dữ liệu từ CMD
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Lắng nghe sự kiện kết nối
socket.on("connect", () => {
  console.log("Client connected to server with ID:", socket.id);

  // Đăng ký role là 'employee'
  socket.emit("register", "employee");

  // Bắt đầu yêu cầu nhập thông tin đơn hàng
  const order = {};
  const askForItem = () => {
    rl.question("Enter item name: ", (item) => {
      if (!item.trim()) {
        console.log("Item name cannot be empty!");
        return askForItem();
      }
      order.item = item.trim();
      askForQuantity();
    });
  };

  const askForQuantity = () => {
    rl.question("Enter quantity: ", (quantity) => {
      if (isNaN(quantity) || parseInt(quantity) <= 0) {
        console.log("Quantity must be a valid number greater than 0!");
        return askForQuantity();
      }
      order.quantity = parseInt(quantity.trim());

      // Gửi sự kiện 'newOrder'
      socket.emit("newOrder", order);
      console.log("Sent newOrder event:", order);

      // Hỏi tiếp nếu muốn nhập đơn mới
      askForAnotherOrder();
    });
  };

  const askForAnotherOrder = () => {
    rl.question("Do you want to place another order? (yes/no): ", (answer) => {
      if (answer.trim().toLowerCase() === "yes") {
        askForItem();
      } else {
        console.log("Exiting...");
        rl.close();
        socket.disconnect();
      }
    });
  };

  askForItem();
});

// Lắng nghe sự kiện ngắt kết nối
socket.on("disconnect", () => {
  console.log("Disconnected from server");
  rl.close();
});
