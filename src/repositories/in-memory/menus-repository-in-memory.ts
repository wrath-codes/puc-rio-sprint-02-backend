import { Menu, Prisma } from '@prisma/client';

import { MenusRepository } from '../interfaces/menus-repository';
import { randomUUID } from 'node:crypto';

export class InMemoryMenusRepository implements MenusRepository {

  private menus: Menu[] = [];

  async create(data: Prisma.MenuUncheckedCreateInput): Promise<Menu> {
    const menu = {
      id: data.id || randomUUID(),
      created_at: new Date(),
    } as Menu;

    this.menus.push(menu);

    return menu;
  }

  async findById(id: string): Promise<Menu | null> {
    const menu = this.menus.find((menu) => menu.id === id);
    if (!menu) return null;
    return menu;
  }

  async delete(id: string): Promise<void | null> {
    const menu = this.menus.find((menu) => menu.id === id);
    if (!menu) return null;

    this.menus = this.menus.filter((menu) => menu.id !== id);
  }

  async list(): Promise<Menu[]> {
    return this.menus;
  }

}


