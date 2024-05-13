const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const rooms = [];
const bookings = [];

const generateBookingId = () => {
  return bookings.length + 1;
};

//Route to list all rooms
app.get("/rooms", (req, res) => {
  res.json(rooms);
  console.log(rooms);
});

//Route to create a room
app.post("/create-room", (req, res) => {
  const { roomNumber, seatsAvailable, amenities, pricePerHour } = req.body;

  if (!roomNumber || !seatsAvailable || !pricePerHour) {
    return res.status(400).json({
      message: "Room number, Seats available, Priceper hour are required",
    });
  }

  //check if the room number already exists
  const isRoomExist = rooms.some((room) => room.roomNumber === roomNumber);

  if (isRoomExist) {
    return res.status(409).json({ message: "Room number already exists" });
  }

  //Add the room to the list
  rooms.push({
    roomNumber,
    seatsAvailable,
    amenities,
    pricePerHour,
  });

  res.json({ message: "Room created successfully" });
});

//Route to book a room
app.post("/book-room", (req, res) => {
  const { roomId, customerName, date, startTime, endTime } = req.body;

  if (!roomId || !customerName || !date || !startTime || !endTime) {
    return res.status(400).json({
      message: "RoomId, CustomerName, Date, StartTime, EndTime are required",
    });
  }

  //check if the room exists
  const room = rooms.find((room) => room.roomNumber === roomId);
  console.log(room);
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  //check if the room is available for booking
  const isRoomAvailable = true;
  if (!isRoomAvailable) {
    return res.status(409).json({ message: "Room is not available" });
  }

  //generate a unique bookingID
  const bookingId = generateBookingId();

  //Add the booking to the list
  bookings.push({
    bookingId,
    roomId,
    customerName,
    date,
    startTime,
    endTime,
    bookingDate: new Date(),
    bookingStatus: "Confirmed",
  });
  res.json({ message: "Room booked successfully" });
});

//Route to list bookingRoom
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

//Route to list all rooms with bookings
app.get("/roomswith-bookings", (req, res) => {
  const roomsWithBookings = rooms.map((room) => {
    const roomBookings = bookings.filter(
      (booking) => booking.roomId === room.roomNumber
    );
    return {
      roomName: room.roomNumber,
      bookings: roomBookings.map((booking) => ({
        customerName: booking.customerName,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        bookingStatus: booking.bookingStatus,
      })),
    };
  });
  res.json(roomsWithBookings);
});

//Route to list all customer with bookings
app.get("/customerswith-bookings", (req, res) => {
  const customersWithBookings = bookings.map((booking) => ({
    customerName: booking.customerName,
    roomName: booking.roomId,
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime,
  }));
  res.json(customersWithBookings);
});

//Route to list how many times a customer has booked a room with details
app.get("/customer-booking-history/:customerName", (req, res) => {
  const customerName = req.params.customerName;
  const customerBookingHistory = bookings.filter(
    (booking) => booking.customerName === customerName
  );
  res.json(customerBookingHistory);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
