type ResponseError = {
  error: { message: string };
};

type Contributions = {
  amount: bigint;
  contributor: string;
  campaignId: bigint;
  timestamp: string;
};

type Campaign = {
  id: bigint;
  creator: string;
  title: string;
  description: string;
  goal: bigint;
  raised: bigint;
  isActive: boolean;
  contributions: Contributions[];
  createdAt: string;
  deadline: string;
};

type User = {
  name: string;
  address: string;
  isRegistered: boolean;
};
