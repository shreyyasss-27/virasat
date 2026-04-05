import { Card, CardContent } from "@/components/ui/card"

const stats = [
  { label: "Active Artisans", value: "1,200+" },
  { label: "Cultural Topics", value: "500+" },
  { label: "Community Members", value: "25,000+" },
  { label: "Learning Videos", value: "300+" },
]

export default function StatsSection() {
  return (
    <section className="px-5 py-16 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/10 dark:to-red-950/10">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
