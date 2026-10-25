-- Synthetic LOCAL preview only. Never execute against hosted databases.
INSERT OR REPLACE INTO analytics_state(key,value) VALUES('activity_started_at',strftime('%Y-%m-%dT%H:%M:%fZ','now','-1 hour'));
INSERT OR REPLACE INTO traffic_daily(day,views,estimated_visitors,identified_views,geo_views,first_recorded_at) VALUES(date('now','+9 hours'),3,2,3,3,strftime('%Y-%m-%dT%H:%M:%fZ','now','-1 hour'));
INSERT OR REPLACE INTO traffic_daily(day,views,estimated_visitors,identified_views,geo_views,first_recorded_at) VALUES(date('now','+9 hours','-1 day'),4,2,4,4,strftime('%Y-%m-%dT%H:%M:%fZ','now','-1 day'));
INSERT OR REPLACE INTO traffic_daily(day,views,estimated_visitors,identified_views,geo_views,first_recorded_at) VALUES(date('now','+9 hours','-2 day'),2,1,2,2,strftime('%Y-%m-%dT%H:%M:%fZ','now','-2 day'));
INSERT OR REPLACE INTO traffic_activity VALUES('local-demo-1',date('now','+9 hours'),strftime('%Y-%m-%dT%H:%M:%fZ','now','-2 minute'),'aaaaaaaaaaaa0000','local-session-1','/#home','데스크톱','KR','Seoul','Seoul','검색');
INSERT OR REPLACE INTO traffic_activity VALUES('local-demo-2',date('now','+9 hours'),strftime('%Y-%m-%dT%H:%M:%fZ','now','-1 minute'),'aaaaaaaaaaaa0000','local-session-1','/#case/yuriyuri','데스크톱','KR','Seoul','Seoul','직접·출처 미상');
INSERT OR REPLACE INTO traffic_activity VALUES('local-demo-3',date('now','+9 hours'),strftime('%Y-%m-%dT%H:%M:%fZ','now'),'bbbbbbbbbbbb0000','local-session-2','/notes#note/nike-heritage','모바일','US','Unknown','Unknown','직접·출처 미상');
INSERT OR REPLACE INTO traffic_activity VALUES('local-demo-4',date('now','+9 hours','-1 day'),strftime('%Y-%m-%dT%H:%M:%fZ','now','-1 day'),'aaaaaaaaaaaa0000','local-session-0','/#home','데스크톱','KR','Unknown','Unknown',NULL);
INSERT OR REPLACE INTO analytics_state VALUES('interaction_started_at',strftime('%Y-%m-%dT%H:%M:%fZ','now','-1 hour'));
INSERT OR REPLACE INTO traffic_clicks VALUES('local-click-1',date('now','+9 hours'),strftime('%Y-%m-%dT%H:%M:%fZ','now'),'aaaaaaaaaaaa0000','local-session-1','/#home','CV 열기');
INSERT OR REPLACE INTO traffic_clicks VALUES('local-click-2',date('now','+9 hours'),strftime('%Y-%m-%dT%H:%M:%fZ','now'),'bbbbbbbbbbbb0000','local-session-2','/notes','이메일 문의');
INSERT OR REPLACE INTO traffic_presence VALUES('aaaaaaaaaaaa0000','local-session-1',strftime('%Y-%m-%dT%H:%M:%fZ','now','-2 minute'),strftime('%Y-%m-%dT%H:%M:%fZ','now'),'/#case/yuriyuri','데스크톱','KR','Seoul','Seoul');
INSERT OR REPLACE INTO traffic_presence VALUES('bbbbbbbbbbbb0000','local-session-2',strftime('%Y-%m-%dT%H:%M:%fZ','now'),strftime('%Y-%m-%dT%H:%M:%fZ','now'),'/notes#note/nike-heritage','모바일','US','Unknown','Unknown');
INSERT OR REPLACE INTO traffic_regions_daily VALUES(date('now','+9 hours'),'KR','Seoul','Seoul',2,1);
INSERT OR REPLACE INTO traffic_regions_daily VALUES(date('now','+9 hours'),'US','Unknown','Unknown',1,1);
