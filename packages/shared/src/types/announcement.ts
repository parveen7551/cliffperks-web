import type { ISODate, UUID } from "./common";

/** Mirrors apps.employers.serializers.AnnouncementSerializer. */
export interface Announcement {
  id: UUID;
  title_en: string;
  title_fr: string;
  body_en: string;
  body_fr: string;
  published_at: ISODate | null;
  created_at: ISODate;
  updated_at: ISODate;
}

export type AnnouncementCreate = Pick<
  Announcement,
  "title_en" | "title_fr" | "body_en" | "body_fr"
> & { published_at?: ISODate | null };
