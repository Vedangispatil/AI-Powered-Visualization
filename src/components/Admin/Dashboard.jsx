

import React, { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Grid2,
  Paper,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  Toolbar,
  Chip,
} from "@mui/material"
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid2,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts"
import {
  TrendingUp,
  People,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart,
  MoreVert,
  Person,
  ScatterPlot,
} from "@mui/icons-material"
import NavBar from "./NavBar"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,


} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import api from "../../api/apiInstance";
import Loader from "../Common/Loader";
import AlertPop from "../Common/AlertPop";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  BarElement,
  Legend, PointElement, LineElement, ArcElement, ChartDataLabels
);






const userActivityData = [
  { name: "Jan", users: 400, graphs: 240 },
  { name: "Feb", users: 300, graphs: 139 },
  { name: "Mar", users: 200, graphs: 980 },
  { name: "Apr", users: 278, graphs: 390 },
  { name: "May", users: 189, graphs: 480 },
  { name: "Jun", users: 239, graphs: 380 },
  { name: "Jul", users: 349, graphs: 430 },
]




const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];




// Sample data for charts


const chartTypeData = [
  { name: "Bar Charts", value: 400 },
  { name: "Line Charts", value: 300 },
  { name: "Pie Charts", value: 200 },
  { name: "Area Charts", value: 100 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const topUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", graphsCreated: 12 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", graphsCreated: 8 },
  { id: 3, name: "Robert Johnson", email: "robert@example.com", graphsCreated: 5 },
]

const recentGraphs = [
  { id: 1, title: "Monthly Sales Analysis", type: "Bar Chart", creator: "John Doe" },
  { id: 2, title: "User Growth Trends", type: "Line Chart", creator: "Jane Smith" },
  { id: 3, title: "Revenue Distribution", type: "Pie Chart", creator: "Robert Johnson" },
]

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({header:{totalUsers:0,totalGraphs:0,totalDatasets:0, currentMonthGraphs:0}, activity:{monthlyUsers:{}, monthlyGraphs:{}}, distribution:{}, topCreators:[], recentCreations:[], monthlyGraphsByTypes:{months:{}}})
  const [openLoader, setOpenLoader] = useState(false)
  const [alertConfig, setAlertConfig] = useState({ open: false, type: 'error', message: '' })
  useEffect(() => {
    const fetchDashboard = async () => {
      try{
      setOpenLoader(true)
      const response = await api.get('/dashbord', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      // console.log(response)
      setDashboardData(response.data)
    }
    catch (error) {
        setAlertConfig({ open: true, type: 'error', message: error.response.data.message })
    }
    finally{
      setOpenLoader(false)
    }

    }
    fetchDashboard()
  }, [])

  const data = {
    labels: Object.keys(dashboardData.activity.monthlyUsers),
    datasets: [
      {
        label: 'Users',
        data: Object.values(dashboardData.activity.monthlyUsers),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
  
        tension: 0.4,
      },
      {
        label: 'Graphs',
        data: Object.values(dashboardData.activity.monthlyGraphs),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.4,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        display: false
      },
      legend: {
        position: 'bottom',
      },
    },
  
  };

  const piaData = {
    labels: Object.keys(dashboardData.distribution),
    datasets: [
      {
  
        data: Object.values(dashboardData.distribution),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  const piaOpt = {
    responsive: true,
   
    plugins: {
      legend: {
        position: 'bottom',
      },
  
    },
  }

  const dataBar = {
    labels: Object.keys(dashboardData.monthlyGraphsByTypes),
    datasets : Object.keys(Object.values(dashboardData.monthlyGraphsByTypes)[0]).map(type=>{
      //const monthData = dashboardData.monthlyGraphsByTypes[month]
      return {
        label: type,
        data :Object.keys(dashboardData.monthlyGraphsByTypes).map(month=>{
          const monthData = dashboardData.monthlyGraphsByTypes[month]
          return monthData[type]
        })

      }
      
    })
    
  };
  
  const optionsBar = {
    responsive: true,
  
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Graph Creation ',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].label;
          },
          label: (tooltipItem) => {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
    hover: {
      mode: 'index',
      intersect: false,
  
    },
  };
  
  return (
    <>
      <Box sx={{ display: 'flex', }}>
        <NavBar />
        <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 8, }}>
          <Grid2 container spacing={3} sx={{ mb: 4 }}>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 140,
                  background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                  color: "white",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography component="h2" variant="h6" gutterBottom>
                    Total Users
                  </Typography>
                  <People />
                </Box>
                <Typography component="p" variant="h4">
                {dashboardData.header.totalUsers}
                </Typography>
                
              </Paper>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 140,
                  background: "linear-gradient(45deg, #4CAF50 30%, #81C784 90%)",
                  color: "white",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography component="h2" variant="h6" gutterBottom>
                    Total Datasets
                  </Typography>
                  <TrendingUp />
                </Box>
                <Typography component="p" variant="h4">
                {dashboardData.header.totalDatasets}
                </Typography>
                
              </Paper>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 140,
                  background: "linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)",
                  color: "white",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography component="h2" variant="h6" gutterBottom>
                    Total Graphs
                  </Typography>
                  <BarChartIcon />
                </Box>
                <Typography component="p" variant="h4">
                {dashboardData.header.totalGraphs}
                </Typography>
                
              </Paper>
            </Grid2>

            

            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 140,
                  background: "linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)",
                  color: "white",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography component="h2" variant="h6" gutterBottom>
                    Total Graphs{<Typography display={'inline-block'} fontSize={8}>(This Month) </Typography>}
                  </Typography>
                  <ShowChart />
                </Box>
                <Typography component="p" variant="h4">
                  {dashboardData.header.currentMonthGraphs}
                </Typography>
                
              </Paper>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 8 }}>

              <Paper sx={{  height: { xs: '300px', md: '350px' }, p: 2 }} elevation={5} >
                <Typography mb={1} component={'h3'} variant="p">User Activity & Graph Creation (Last 6 months) </Typography>
                <Line options={options} data={data} />
              </Paper>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>

              <Paper sx={{ height: { xs: '400px', md: '350px' }, width:'100%', p: 2, overflow:'hidden' }} elevation={5}>
                <Typography mb={1} component={'h3'} variant="p">Chart Types Distribution</Typography>
                <Pie data={piaData} options={piaOpt} />

              </Paper>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>

              <Paper sx={{ height: { xs: 'auto', md: '350px' }, p: 2 }} elevation={5}>
                <Typography component={'h3'} variant="p">Top Users by Graph Creation</Typography>
                <List  >
                  {dashboardData.topCreators.map((user) => (
                    <React.Fragment key={user._id}>
                      <ListItem >
                        <ListItemAvatar>
                          <Avatar sizes="small">
                            <Person />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={user.name} secondary={user.email} />
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {user.graphCount} graphs
                          </Typography>
                        </Box>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>

              </Paper>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>

              <Paper sx={{ height: { xs: 'auto', md: '350px' }, p: 2 }} elevation={5}>
                <Typography mb={1} component={'h3'} variant="p">Recently Created Graphs </Typography>
                <List>
                  {dashboardData.recentCreations.map((graph, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor:
                                graph.graphType === "bar"
                                  ? "#0088FE"
                                  : graph.graphType === "line"
                                    ? "#00C49F"
                                    : graph.graphType === "pie"
                                      ? "#FFBB28"
                                      : "#FF8042",
                            }}
                          >
                            {graph.graphType === "bar" ? (
                              <BarChartIcon />
                            ) : graph.graphType === "line" ? (
                              <ShowChart />
                            ) : graph.graphType === "pie" ? (
                              <PieChartIcon />
                            ) : (
                              <ScatterPlot />
                            )}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={graph.graphTitle} secondary={`Created by ${graph.creatorName}`} />
                        <Box>
                          <Chip label={graph.graphType + ' graph'} >

                          </Chip>

                        </Box>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid2>
            <Grid2 size={12}>
              <Paper sx={{ height: 'auto', p: 2 }} elevation={5}>
                <Typography mb={1} component={'h3'} variant="p">Monthly Graph Creation by Type (Last 6 Months) </Typography>
                <Bar data={dataBar} options={optionsBar} />
              </Paper>

            </Grid2>
          </Grid2>
        </Box>
        <Loader openLoader={openLoader} />
        <AlertPop alertConfig={alertConfig} />
      </Box>
    </>

  )
}
