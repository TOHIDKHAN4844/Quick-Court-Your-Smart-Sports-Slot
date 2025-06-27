// UserProfile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import config from '../config';

// const formatTime = (timeStr) => {
//   // console.log("Raw time from DB:", timeStr);

//   if (!timeStr || typeof timeStr !== 'string') return "Invalid Time";

//   const [hourStr, minuteStr] = timeStr.split(":");
//   let hour = parseInt(hourStr, 10);
//   let minute = parseInt(minuteStr, 10);

//   if (isNaN(hour) || isNaN(minute)) return "Invalid Time";

//   // Create a UTC date using today's date
//   const date = new Date(Date.UTC(1970, 0, 1, hour, minute));

//   // Subtract 5 hours 30 minutes (330 minutes)
//   date.setUTCMinutes(date.getUTCMinutes() + 390);

//   // Format as 12-hour IST-style time
//   return date.toLocaleTimeString('en-IN', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//     timeZone: 'UTC', // Stay in UTC to avoid re-shifting
//   });
// };


const UserProfile = () => {
  const [user, setUser] = useState({});
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const userResponse = await axios.get(
          `${config.API_URL}/api/User/getUserDetailS/${userId}`
        );
        setUser(userResponse.data);

        // If user is a customer, fetch bookings
        if (userResponse.data.role === "customer") {
          const bookingsResponse = await axios.get(
            `${config.API_URL}/api/User/getBookingDetailS/${userId}`
          );
          setBookings(bookingsResponse.data);
        }

        setLoading(false); // Stop loading after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchData();
  }, [navigate, userId]);

  return (
    <Sidebar>
      <Container maxWidth="md">
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* User Profile Card */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardHeader
                  title="User Profile"
                  sx={{
                    textAlign: "center",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: "bold",
                    color: "#6610f2",
                  }}
                />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Name:"
                        secondary={user?.name || "N/A"}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Email:"
                        secondary={user?.email || "N/A"}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Role:"
                        secondary={user?.role || "N/A"}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Bookings Card */}
            {user?.role === "customer" && (
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                  <CardHeader
                    title="My Bookings"
                    sx={{
                      textAlign: "center",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: "bold",
                      color: "#6610f2",
                    }}
                  />
                  <CardContent sx={{ maxHeight: 400, overflowY: "auto" }}>
                    {bookings.length > 0 ? (
                      bookings.map((booking, index) => (
                        <Card
                          key={index}
                          sx={{ mb: 2, boxShadow: 2, borderRadius: 1 }}
                        >
                          <CardContent>
                            <List>
                              <ListItem>
                                <ListItemText
                                  primary="Centre:"
                                  secondary={booking.centre}
                                />
                              </ListItem>
                              <Divider />
                              <ListItem>
                                <ListItemText
                                  primary="Sport:"
                                  secondary={booking.sport}
                                />
                              </ListItem>
                              <Divider />
                              <ListItem>
                                <ListItemText
                                  primary="Court:"
                                  secondary={booking.court}
                                />
                              </ListItem>
                              <Divider />
                              <ListItem>
                                <ListItemText
                                  primary="Date:"
                                  secondary={booking.date}
                                />
                              </ListItem>
                              <Divider />
                              <ListItem>
                              <ListItemText
                                    primary="Time:"
                                    // secondary={`${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`}
                                    secondary={`${booking.startTime} - ${booking.endTime}`}
  />
                              </ListItem>
                            </List>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Typography variant="body1" align="center">
                        No bookings found.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Loader */}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </Sidebar>
  );
};

export default UserProfile;
