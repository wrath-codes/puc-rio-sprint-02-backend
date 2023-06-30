import { Menu, Prisma } from "@prisma/client";

export interface MenusRepository {
  create(data: Prisma.MenuUncheckedCreateInput): Promise<Menu>;
  findById(id: string): Promise<Menu | null>;
  findLatest(): Promise<Menu | null>;
  delete(id: string): Promise<void | null>;
  list(): Promise<Menu[]>;
}
