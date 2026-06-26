import type { User } from "@/types/user";

interface RawResult {
  login: { uuid: string };
  name: { title: string; first: string; last: string };
  gender: string;
  email: string;
  phone: string;
  location: {
    country: string;
    city: string;
    state: string;
    street: { number: number; name: string };
  };
  dob: { date: string; age: number };
  picture: { large: string; thumbnail: string };
}

export async function fetchRandomUsers(count = 10): Promise<User[]> {
  const res = await fetch(`https://randomuser.me/api/?results=${count}&nat=us,gb,au`);
  if (!res.ok) throw new Error("Failed to fetch from randomuser.me");
  const data = await res.json();
  return (data.results as RawResult[]).map(mapUser);
}

function mapUser(r: RawResult): User {
  return {
    id: r.login.uuid,
    title: r.name.title,
    first: r.name.first,
    last: r.name.last,
    gender: r.gender,
    email: r.email,
    phone: r.phone,
    country: r.location.country,
    city: r.location.city,
    state: r.location.state,
    street: `${r.location.street.number} ${r.location.street.name}`,
    dob: r.dob.date,
    age: r.dob.age,
    picture: r.picture.large,
    thumbnail: r.picture.thumbnail,
  };
}
