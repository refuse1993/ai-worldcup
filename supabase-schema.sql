-- Supabase 데이터베이스 스키마
-- Supabase 대시보드 > SQL Editor에서 실행하세요

-- 1. 월드컵 테이블
create table if not exists worldcups (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  candidates jsonb not null,
  plays integer default 0,
  created_at timestamp with time zone default now()
);

-- 2. 결과 테이블
create table if not exists results (
  id uuid primary key default gen_random_uuid(),
  worldcup_id uuid references worldcups(id) on delete cascade,
  winner_name text not null,
  winner_image text,
  created_at timestamp with time zone default now()
);

-- 3. 인덱스 생성 (성능 최적화)
create index if not exists worldcups_created_at_idx on worldcups(created_at desc);
create index if not exists worldcups_plays_idx on worldcups(plays desc);
create index if not exists results_worldcup_id_idx on results(worldcup_id);
create index if not exists results_created_at_idx on results(created_at desc);

-- 4. Row Level Security (RLS) 활성화
alter table worldcups enable row level security;
alter table results enable row level security;

-- 5. RLS 정책: 모든 사람이 읽을 수 있음
create policy "Anyone can read worldcups"
  on worldcups for select
  using (true);

create policy "Anyone can read results"
  on results for select
  using (true);

-- 6. RLS 정책: 인증된 사용자만 쓸 수 있음 (선택사항)
create policy "Anyone can create worldcups"
  on worldcups for insert
  with check (true);

create policy "Anyone can create results"
  on results for insert
  with check (true);

-- 7. 뷰: 인기 월드컵 TOP 10
create or replace view popular_worldcups as
select
  id,
  topic,
  plays,
  created_at
from worldcups
order by plays desc
limit 10;

-- 8. 함수: 월드컵 플레이 카운트 증가
create or replace function increment_plays(worldcup_uuid uuid)
returns void as $$
begin
  update worldcups
  set plays = plays + 1
  where id = worldcup_uuid;
end;
$$ language plpgsql;
