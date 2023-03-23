import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { useDashboardContext } from "context/Dashboard";
import { useMemo } from "react";
import AnomalyCard from "./AnomalyCard";

export default function Anomalies() {
  const { anomalies, anomaly } = useDashboardContext();
  const totalAnomalies = useMemo(() => anomalies.length, [anomalies]);
  const totalNewAnomalies = useMemo(
    () => anomalies.filter((a) => !a.fetchedAt).length,
    [anomalies]
  );

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="body2">{totalAnomalies} Alerts</Typography>
        <Chip label={`${totalNewAnomalies} New`} color="primary" />
      </Box>
      <Divider sx={{ my: 2, mx: -2, backgroundColor: "#A2AEBC" }} />
      {anomalies.map((a) => {
        const selected = String(anomaly?.id) === String(a.id);
        return <AnomalyCard key={a.id} anomaly={a} selected={selected} />;
      })}
    </>
  );
}
