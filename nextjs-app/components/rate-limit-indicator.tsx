"use client"

import { Lock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getRateLimit } from "@/app/actions"
import useSWR from "swr"

export function RateLimitIndicator({ rateLimitProp }: { rateLimitProp: { allowed: boolean, count: number } }) {
  const { data } = useSWR('rateLimit', getRateLimit, {
    refreshInterval: 3000,
    fallbackData: rateLimitProp
  })

  const usage = (data.count / 5) * 100
  const color = usage > 80 ? "text-red-500" : usage > 50 ? "text-orange-500" : "text-green-500"

  // SVG circle parameters
  const size = 48
  const strokeWidth = 3
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (usage / 100) * circumference

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative cursor-help">
              {/* Circular progress background */}
              <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  className="text-muted-foreground/20"
                />
                {/* Progress circle */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className={`transition-all duration-300 ${color}`}
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Lock icon in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className={`w-4 h-4 ${color}`} />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <div>
              <div className="font-semibold">Upload Limit</div>
              <div className="text-sm">{data.count} of 5 uploads used this hour</div>
              <div className="text-xs text-muted-foreground">Resets after 1 hour</div>
              {!data.allowed && <div className="text-red-400 text-sm">Limit reached</div>}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}