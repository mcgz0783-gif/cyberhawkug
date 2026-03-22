import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, Users, DollarSign, ShoppingCart } from "lucide-react";

type MonthlyData = { month: string; revenue: number; orders: number };
type CustomerData = { month: string; customers: number };
type CategoryData = { name: string; value: number };

const COLORS = ["hsl(173,100%,50%)", "hsl(50,100%,50%)", "hsl(348,100%,61%)", "hsl(210,40%,85%)", "hsl(215,42%,30%)"];

const AdminAnalytics = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyData[]>([]);
  const [customerGrowth, setCustomerGrowth] = useState<CustomerData[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryData[]>([]);
  const [totals, setTotals] = useState({ revenue: 0, orders: 0, customers: 0, avgOrder: 0 });

  useEffect(() => {
    const fetchAnalytics = async () => {
      // Fetch completed purchases
      const { data: purchases } = await supabase
        .from("purchases")
        .select("amount_paid, created_at, ebook_id")
        .eq("status", "COMPLETED");

      // Fetch customers
      const { data: profiles } = await supabase
        .from("profiles")
        .select("created_at")
        .eq("role", "CUSTOMER");

      // Fetch ebooks for categories
      const { data: ebooks } = await supabase
        .from("ebooks")
        .select("id, category");

      if (purchases) {
        // Monthly revenue
        const monthly: Record<string, { revenue: number; orders: number }> = {};
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
          monthly[key] = { revenue: 0, orders: 0 };
        }
        purchases.forEach((p) => {
          const d = new Date(p.created_at);
          const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
          if (monthly[key]) {
            monthly[key].revenue += p.amount_paid;
            monthly[key].orders += 1;
          }
        });
        setMonthlyRevenue(Object.entries(monthly).map(([month, d]) => ({ month, revenue: d.revenue / 100, orders: d.orders })));

        const totalRev = purchases.reduce((s, p) => s + p.amount_paid, 0);
        setTotals({
          revenue: totalRev,
          orders: purchases.length,
          customers: profiles?.length || 0,
          avgOrder: purchases.length ? totalRev / purchases.length : 0,
        });

        // Category breakdown
        if (ebooks) {
          const ebookMap = Object.fromEntries(ebooks.map((e) => [e.id, e.category || "Uncategorized"]));
          const cats: Record<string, number> = {};
          purchases.forEach((p) => {
            const cat = ebookMap[p.ebook_id] || "Uncategorized";
            cats[cat] = (cats[cat] || 0) + 1;
          });
          setCategoryBreakdown(Object.entries(cats).map(([name, value]) => ({ name, value })));
        }
      }

      // Customer growth
      if (profiles) {
        const monthly: Record<string, number> = {};
        const now = new Date();
        let cumulative = 0;
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
          monthly[key] = 0;
        }
        profiles.forEach((p) => {
          const d = new Date(p.created_at);
          const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
          if (monthly[key] !== undefined) monthly[key] += 1;
        });
        const growth: CustomerData[] = [];
        // Count profiles before our 12-month window
        const windowStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        cumulative = profiles.filter((p) => new Date(p.created_at) < windowStart).length;
        Object.entries(monthly).forEach(([month, count]) => {
          cumulative += count;
          growth.push({ month, customers: cumulative });
        });
        setCustomerGrowth(growth);
      }
    };
    fetchAnalytics();
  }, []);

  const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const statCards = [
    { icon: DollarSign, label: "TOTAL REVENUE", value: fmt(totals.revenue) },
    { icon: ShoppingCart, label: "TOTAL ORDERS", value: totals.orders },
    { icon: Users, label: "TOTAL CUSTOMERS", value: totals.customers },
    { icon: TrendingUp, label: "AVG ORDER VALUE", value: fmt(totals.avgOrder) },
  ];

  return (
    <div>
      <h1 className="font-display font-bold text-2xl tracking-[0.1em] uppercase text-foreground mb-8">
        ANALYTICS
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-10">
        {statCards.map((s) => (
          <div key={s.label} className="border border-border bg-card p-6">
            <s.icon className="w-6 h-6 text-primary mb-2" />
            <div className="font-display font-bold text-2xl text-foreground">{s.value}</div>
            <div className="font-mono text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-2">
        <div className="lg:col-span-2 border border-border bg-card p-6">
          <h2 className="font-display font-semibold text-sm tracking-[0.1em] uppercase text-foreground mb-6">
            MONTHLY REVENUE
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(211,60%,13%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(210,25%,50%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(210,25%,50%)", fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ background: "hsl(218,42%,7%)", border: "1px solid hsl(211,60%,13%)", color: "hsl(210,40%,85%)" }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="hsl(173,100%,50%)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-border bg-card p-6">
          <h2 className="font-display font-semibold text-sm tracking-[0.1em] uppercase text-foreground mb-6">
            SALES BY CATEGORY
          </h2>
          {categoryBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(218,42%,7%)", border: "1px solid hsl(211,60%,13%)", color: "hsl(210,40%,85%)" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] font-mono text-xs text-muted-foreground">NO DATA YET</div>
          )}
        </div>
      </div>

      {/* Customer Growth & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div className="border border-border bg-card p-6">
          <h2 className="font-display font-semibold text-sm tracking-[0.1em] uppercase text-foreground mb-6">
            CUSTOMER GROWTH
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={customerGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(211,60%,13%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(210,25%,50%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(210,25%,50%)", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "hsl(218,42%,7%)", border: "1px solid hsl(211,60%,13%)", color: "hsl(210,40%,85%)" }} />
              <Line type="monotone" dataKey="customers" stroke="hsl(173,100%,50%)" strokeWidth={2} dot={{ fill: "hsl(173,100%,50%)", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-border bg-card p-6">
          <h2 className="font-display font-semibold text-sm tracking-[0.1em] uppercase text-foreground mb-6">
            MONTHLY ORDERS
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(211,60%,13%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(210,25%,50%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(210,25%,50%)", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "hsl(218,42%,7%)", border: "1px solid hsl(211,60%,13%)", color: "hsl(210,40%,85%)" }} />
              <Bar dataKey="orders" fill="hsl(50,100%,50%)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
