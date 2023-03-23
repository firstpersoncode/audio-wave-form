import { useState } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import { useDashboardContext } from "context/Dashboard";
import Anomalies from "./Anomalies";
import Anomaly from "./Anomaly";

export default function Dashboard() {
  const {
    machines,
    machine,
    anomalies,
    anomaly,
    reasons,
    actions,
    selectMachine,
  } = useDashboardContext();

  const [loading, setLoading] = useState(false);

  async function handleChangeMachine(e) {
    setLoading(true);
    await selectMachine(e.target.value);
    setLoading(false);
  }

  return (
    <Box sx={{ p: 8 }}>
      <Box
        sx={{
          py: 1,
          px: 2,
          border: "1px solid #A2AEBC",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          position: "relative",
        }}
      >
        <TextField
          size="small"
          select
          label="Machine"
          value={machine.id}
          onChange={handleChangeMachine}
        >
          {machines.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        {loading && (
          <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
            <LinearProgress />
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            p: 2,
            borderLeft: "1px solid #A2AEBC",
            borderRight: "1px solid #A2AEBC",
            borderBottom: "1px solid #A2AEBC",
            width: 500,
          }}
        >
          <Anomalies />
        </Box>
        <Box
          sx={{
            flex: 1,
            p: 4,
            borderRight: "1px solid #A2AEBC",
            borderBottom: "1px solid #A2AEBC",
          }}
        >
          <Anomaly />
        </Box>
      </Box>
    </Box>
  );
}
