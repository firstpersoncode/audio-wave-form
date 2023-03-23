import { createContext, useContext, useEffect, useRef, useState } from "react";

const dashboardContext = {
  machine: null,
  machines: [],
  anomaly: null,
  anomalies: [],
  reasons: [],
  actions: [],
};

const DashboardContext = createContext(dashboardContext);

export const useDashboardContext = () => useContext(DashboardContext);

function useDashboardState(context) {
  const [ctx, setCtx] = useState(context);
  const fetchControllerRef = useRef();

  async function selectMachine(machineId) {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
      fetchControllerRef.current = null;
    }

    try {
      fetchControllerRef.current = new AbortController();
      const resAnomalies = await fetch(
        `/api/anomalies?machineId=${machineId}`,
        {
          signal: fetchControllerRef.current.signal,
        }
      );
      const anomalies = await resAnomalies.json();
      const resReasons = await fetch(`/api/reasons?machineId=${machineId}`, {
        signal: fetchControllerRef.current.signal,
      });
      const reasons = await resReasons.json();
      fetchControllerRef.current = null;
      setCtx((v) => {
        const machine = v.machines.find(
          (m) => String(m.id) === String(machineId)
        );
        return { ...v, machine, anomalies, anomaly: null, reasons };
      });
    } catch (err) {
      console.error(err.message || err);
    }
  }

  async function selectAnomaly(anomalyId) {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
      fetchControllerRef.current = null;
    }

    setCtx((v) => {
      let anomaly = v.anomalies.find((a) => String(a.id) === String(anomalyId));

      return {
        ...v,
        anomalies: v.anomalies.map((a) => {
          if (String(a.id) === String(anomalyId))
            a.fetchedAt = String(new Date());
          return a;
        }),
        anomaly,
      };
    });

    try {
      fetchControllerRef.current = new AbortController();
      await fetch(`/api/anomaly?id=${anomalyId}`, {
        method: "PUT",
        signal: fetchControllerRef.current.signal,
      });
      fetchControllerRef.current = null;
    } catch (err) {
      console.error(err.message || err);
    }
  }

  async function updateAnomaly(anomalyId, { reasonId, actionId, comments }) {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
      fetchControllerRef.current = null;
    }
    try {
      fetchControllerRef.current = new AbortController();
      await fetch(`/api/anomaly?id=${anomalyId}`, {
        method: "PUT",
        body: JSON.stringify({ reasonId, actionId, comments }),
        signal: fetchControllerRef.current.signal,
      });
      fetchControllerRef.current = null;
      setCtx((v) => {
        const selectedReason = v.reasons.find(
          (r) => String(r.id) === String(reasonId)
        );
        const selectedAction = v.actions.find(
          (act) => String(act.id) === String(actionId)
        );

        return {
          ...v,
          anomalies: v.anomalies.map((a) => {
            if (String(a.id) === String(anomalyId)) {
              a.reason = selectedReason;
              a.action = selectedAction;
              a.comments = comments;
            }
            return a;
          }),
          anomaly: {
            ...v.anomaly,
            reason: selectedReason,
            action: selectedAction,
            comments,
          },
        };
      });
    } catch (err) {
      console.error(err.message || err);
    }
  }

  return {
    ...ctx,
    selectMachine,
    selectAnomaly,
    updateAnomaly,
  };
}

export default function DashboardContextProvider({ children, context }) {
  const state = useDashboardState(context);

  return (
    <DashboardContext.Provider value={state}>
      {children}
    </DashboardContext.Provider>
  );
}
