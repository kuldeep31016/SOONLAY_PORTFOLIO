export const COUNTRIES = [
  "India", "United States", "United Kingdom", "Canada", "Germany",
  "Australia", "Singapore", "Netherlands", "France", "Japan",
  "United Arab Emirates", "Switzerland", "Sweden", "Denmark", "Norway"
] as const;

export const INDIAN_CITIES = [
  "Bangalore", "Mumbai", "Delhi NCR", "Hyderabad", "Pune",
  "Chennai", "Kolkata", "Ahmedabad", "Gurgaon", "Noida",
  "Remote - India"
] as const;

export const US_CITIES = [
  "San Francisco Bay Area", "New York City", "Seattle", "Austin",
  "Boston", "Los Angeles", "Chicago", "Denver", "Remote - US"
] as const;

export const UK_CITIES = [
  "London", "Manchester", "Edinburgh", "Bristol", "Remote - UK"
] as const;

export const EU_CITIES = [
  "Berlin", "Munich", "Amsterdam", "Paris", "Dublin",
  "Stockholm", "Copenhagen", "Zurich", "Remote - EU"
] as const;

export const ALL_CITIES = [
  ...INDIAN_CITIES, ...US_CITIES, ...UK_CITIES, ...EU_CITIES,
  "Remote - Global", "Other"
] as const;

export const LOCATION_HIERARCHY: Record<string, readonly string[]> = {
  "India": INDIAN_CITIES,
  "United States": US_CITIES,
  "United Kingdom": UK_CITIES,
  "Germany": EU_CITIES.filter(c => c.includes("Berlin") || c.includes("Munich")),
  "Netherlands": EU_CITIES.filter(c => c.includes("Amsterdam")),
  "France": EU_CITIES.filter(c => c.includes("Paris")),
  "Singapore": ["Singapore", "Remote - Singapore"],
  "Australia": ["Sydney", "Melbourne", "Remote - Australia"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Remote - Canada"],
  "Other": ALL_CITIES,
} as const;

export const DEPARTMENTS = [
  "Engineering", "Product", "Design", "Data Science", "DevOps & Infrastructure",
  "Quality Assurance", "Security", "Engineering Management",
  "Sales", "Marketing", "Customer Success", "Operations",
  "Finance", "Human Resources", "Legal", "Research"
] as const;

export type Country = typeof COUNTRIES[number];
export type City = typeof ALL_CITIES[number];
export type Department = typeof DEPARTMENTS[number];