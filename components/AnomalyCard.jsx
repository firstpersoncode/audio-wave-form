import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";

import { useDashboardContext } from "context/Dashboard";

export default function AnomalyCard({ anomaly, selected }) {
  const { selectAnomaly } = useDashboardContext();

  function handleSelectAnomaly() {
    selectAnomaly(anomaly.id);
  }

  return (
    <Card
      elevation={selected ? 5 : 0}
      sx={{
        my: 1,
        border: "1px solid #A2AEBC",
        borderRadius: 1,
        position: "relative",
      }}
    >
      <CardActionArea sx={{ p: 2, pl: 4 }} onClick={handleSelectAnomaly}>
        <Typography sx={{ mb: 2 }} variant="subtitle2">
          ID: #{anomaly.id}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", color: "#5F6368" }}
        >
          {anomaly.reason?.label || "Unknown Anomaly"}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Detected at{" "}
          {format(new Date(anomaly.createdAt), "yyyy-MM-dd HH:mm:ss")}
        </Typography>
        <Typography sx={{ color: "#3478FC" }}>
          {anomaly.machine.label}
        </Typography>
      </CardActionArea>
      <Chip
        sx={{ position: "absolute", top: "16px", right: "16px" }}
        color={
          {
            mild: "success",
            moderate: "warning",
            severe: "error",
          }[anomaly.status.name]
        }
        label={anomaly.status.label}
      />
      {!anomaly.fetchedAt && (
        <Box
          sx={{
            position: "absolute",
            left: "10px",
            top: "16px",
            borderRadius: "50%",
            p: 1,
            backgroundColor: "blue",
          }}
        />
      )}
    </Card>
  );
}
