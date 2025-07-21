// app/(pacer)/data.ts
export type Pacer = {
  number: number;
  name: string;
  image: string;
  strategy: string;
  targetTime: string;
};

export const pacers: Pacer[] = [
  {
    number: 1,
    name: "Pacer 1",
    image: "Artboard 1SAP PACERS.png",
    strategy: "Run steady throughout. Walk hydration stations.",
    targetTime: "Sub 2:00 hours",
  },
  {
    number: 2,
    name: "Pacer 2",
    image: "Artboard 2SAP PACERS.png",
    strategy: "Negative split strategy. First half easy, pick up second half.",
    targetTime: "Sub 2:15 hours",
  },
  {
    number: 3,
    name: "Pacer 3",
    image: "Artboard 3SAP PACERS.png",
    strategy: "Even splits throughout. Encourage group pacing.",
    targetTime: "Sub 2:30 hours",
  },
  {
    number: 4,
    name: "Pacer 4",
    image: "Artboard 4SAP PACERS.png",
    strategy: "Run-walk method. Take short breaks every 3 km.",
    targetTime: "Sub 2:45 hours",
  },
  {
    number: 5,
    name: "Pacer 5",
    image: "Artboard 5SAP PACERS.png",
    strategy: "Consistent pace. Minimal talking. Focus on rhythm.",
    targetTime: "Sub 3:00 hours",
  },
  {
    number: 6,
    name: "Pacer 6",
    image: "Artboard 6SAP PACERS.png",
    strategy: "Motivational pacing with cheers and calls every km.",
    targetTime: "Sub 3:15 hours",
  },
  {
    number: 7,
    name: "Pacer 7",
    image: "Artboard 7SAP PACERS.png",
    strategy: "Slow start. Gradual pickup from mid-point.",
    targetTime: "Sub 3:30 hours",
  },
  {
    number: 8,
    name: "Pacer 8",
    image: "Artboard 8SAP PACERS.png",
    strategy: "Walk 1 min every 5 km. Talk through every landmark.",
    targetTime: "Sub 3:45 hours",
  },
  {
    number: 9,
    name: "Pacer 9",
    image: "Artboard 9SAP PACERS.png",
    strategy: "Constant encouragement, maintain zone-2 effort.",
    targetTime: "Sub 4:00 hours",
  },
  {
    number: 10,
    name: "Pacer 10",
    image: "Artboard 10SAP PACERS.png",
    strategy: "Aid-station-focused pacing with nutrition reminders.",
    targetTime: "Sub 4:15 hours",
  },
  {
    number: 11,
    name: "Pacer 11",
    image: "Artboard 11SAP PACERS.png",
    strategy: "Last finisher focus. Supportive and uplifting throughout.",
    targetTime: "Sub 4:30 hours",
  },
];
