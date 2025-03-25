export interface FearGreedData {
  name: string
  data: FearGreedItem[]
  metadata: {
    error: null | string
  }
}

export interface FearGreedItem {
  value: string
  value_classification: FearGreedClassification
  timestamp: string
  time_until_update: string
}

export type FearGreedClassification = "Extreme Fear" | "Fear" | "Neutral" | "Greed" | "Extreme Greed"

export interface FearGreedHistoricalData {
  name: string
  data: FearGreedHistoricalItem[]
  metadata: {
    error: null | string
  }
}

export interface FearGreedHistoricalItem {
  value: string
  value_classification: FearGreedClassification
  timestamp: string
  time_until_update: string
}

export interface FearGreedClassificationInfo {
  name: FearGreedClassification
  description: string
  color: string
  range: [number, number]
}

