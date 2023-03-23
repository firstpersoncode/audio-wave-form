import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";

import { useDashboardContext } from "context/Dashboard";
const Audio = dynamic(() => import("./Audio"), { ssr: false });

export default function Anomaly() {
  const { anomaly, reasons, actions, updateAnomaly } = useDashboardContext();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    reason: "",
    action: "",
    comments: "",
  });

  useEffect(() => {
    setState({
      reason: anomaly?.reason?.id || "",
      action: anomaly?.action?.id || "",
      comments: anomaly?.comments || "",
    });
  }, [anomaly?.reason, anomaly?.action, anomaly?.comments]);

  function handleChange(field) {
    return function (e) {
      setState((v) => ({ ...v, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await updateAnomaly(anomaly.id, {
      reasonId: state.reason || null,
      actionId: state.action || null,
      comments: state.comments || null,
    });
    setLoading(false);
  }

  if (!anomaly) return null;

  return (
    <>
      <Typography variant="h4" sx={{ color: "#5F6368" }}>
        Alert ID: #{anomaly.id}
      </Typography>
      <Typography variant="subtitle2">
        Detected at:{" "}
        {format(new Date(anomaly.createdAt), "yyyy-MM-dd HH:mm:ss")}
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ my: 2, mb: 4, maxWidth: 600 }}>
        <Audio audio={anomaly.clip} />
      </Box>

      <Typography sx={{ fontWeight: "bold", color: "#2A2E5D" }}>
        Equipment
      </Typography>
      <Typography sx={{ mb: 2 }}>{anomaly.machine.label}</Typography>
      <Typography sx={{ fontWeight: "bold", color: "#2A2E5D" }}>
        Suspected Reason
      </Typography>
      <TextField
        select
        fullWidth
        sx={{ mb: 2, maxWidth: 300 }}
        value={state.reason}
        onChange={handleChange("reason")}
      >
        {reasons.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <Typography sx={{ fontWeight: "bold", color: "#2A2E5D" }}>
        Action Required
      </Typography>
      <TextField
        select
        fullWidth
        sx={{ mb: 4, maxWidth: 300 }}
        value={state.action}
        onChange={handleChange("action")}
      >
        {actions.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <Typography sx={{ fontWeight: "bold", color: "#2A2E5D" }}>
        Comments
      </Typography>
      <TextField
        fullWidth
        multiline
        minRows={4}
        sx={{ display: "block", mb: 4, maxWidth: 600 }}
        value={state.comments}
        onChange={handleChange("comments")}
      />
      <Button
        disabled={loading}
        type="submit"
        variant="contained"
        onClick={handleSubmit}
      >
        UPDATE
      </Button>
    </>
  );
}
