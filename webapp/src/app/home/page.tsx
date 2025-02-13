'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { Agent, Mission, useGetAgents, useGetMissions } from './actions';
import AgentProfile from '@components/AgentProfile';
import { VerticalCarousel } from '@components/VerticalCarousel';

const DEFAULT_AGENT_SLOT = Array(3).fill(null);
export default function Home() {
  const { data: missions } = useGetMissions();
  const { data: agents } = useGetAgents();

  const [selectedMission, setSelectedMission] = useState<Mission>();
  const [agentSlots, setAgentSlots] =
    useState<(Agent | null)[]>(DEFAULT_AGENT_SLOT);

  const handleMissionChange = useCallback(
    (missionId: number) => {
      const mission = missions?.find((m) => m.id === missionId);
      if (!mission) return;

      setSelectedMission(mission);
      setAgentSlots(Array(mission.agentPreset.length).fill(null));
    },
    [missions],
  );

  const handleAgentSlotChange = useCallback(() => {
    if (!selectedMission || !agents) return;

    const matchedAgents = selectedMission.agentPreset.map(
      (id) => agents.find((a) => a.id === id) ?? null,
    );
    setAgentSlots(matchedAgents ?? DEFAULT_AGENT_SLOT);
  }, [agents, selectedMission]);

  const unassignedAgents = useMemo(() => {
    const assignedAgentIds = agentSlots
      .filter((slot) => slot !== null)
      .map((slot) => (slot as Agent).id);

    return agents?.filter((agent) => !assignedAgentIds.includes(agent.id));
  }, [agents, agentSlots]);

  useEffect(() => {
    // To ensure smooth transitions for the AgentProfile animations,
    // we trigger handleAgentSlotChange only after agentSlots has been fully cleared.
    // This allows the framer-motion layoutId based animations to work correctly.
    if (!agentSlots.every((slot) => slot === null)) return;
    handleAgentSlotChange();
  }, [agentSlots, handleAgentSlotChange]);

  return (
    <LayoutGroup>
      <div className="flex h-full w-full flex-col items-center justify-center gap-y-8 p-6">
        <h1 className="text-3xl font-bold">Agent Collaborative Network</h1>

        <div className="flex items-center gap-x-10">
          <h2 className="text-2xl font-bold">Missions</h2>
          <VerticalCarousel
            items={
              missions?.map((mission) => ({
                value: mission.id.toString(),
                name: mission.name,
              })) ?? []
            }
            selectedValue={selectedMission?.id.toString()}
            onClick={(value) => handleMissionChange(Number(value))}
          />
        </div>

        <div className="flex gap-x-4">
          {agentSlots.map((agent, index) => (
            <div
              key={`agent-slot-${index}`}
              className="flex h-32 w-32 items-center justify-center border border-gray-400"
            >
              {agent && (
                <motion.div layoutId={`agent-${agent.id}`}>
                  <AgentProfile name={agent.name} imageUrl={agent.iconUrl}>
                    <AgentProfile.Label>{agent.name}</AgentProfile.Label>
                  </AgentProfile>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          {unassignedAgents?.map((agent) => (
            <motion.div key={agent.id} layoutId={`agent-${agent.id}`}>
              <AgentProfile name={agent.name} imageUrl={agent.iconUrl}>
                <AgentProfile.Label>{agent.name}</AgentProfile.Label>
              </AgentProfile>
            </motion.div>
          ))}
        </div>
      </div>
    </LayoutGroup>
  );
}
