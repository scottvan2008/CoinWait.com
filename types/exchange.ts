export interface Exchange {
  id: string
  name: string
  trust_score_rank: number
  trust_score: number
  trade_volume_24h_btc: number | null
  trade_volume_24h_usd: number
  trade_volume_24h_btc_normalized: number | null
  trade_volume_24h_usd_normalized: number
  year_established: number | null
  country: string | null
  description: string
  url: string
  image: string
}

export interface ExchangeData {
  exchanges: Exchange[]
  last_updated: string
  count: number
  btc_price_used: number
}

export type SortField =
  | "trust_score_rank"
  | "name"
  | "trust_score"
  | "trade_volume_24h_btc"
  | "trade_volume_24h_usd"
  | "year_established"
  | "country"

export type SortDirection = "asc" | "desc"

export interface FilterOptions {
  search: string
  minTrustScore: number
  country: string | null
  yearEstablished: number | null
}

