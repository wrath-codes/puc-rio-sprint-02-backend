import { beforeEach, describe, expect, it } from "vitest";

import { CreateMenuUseCase } from "./create-menu";
import { InMemoryMenusRepository } from "@/repositories/in-memory/menus-repository-in-memory";
import dayjs from "dayjs";

let menusRepository: InMemoryMenusRepository;
let sut: CreateMenuUseCase;

describe("Create Menu Use Case", () => {
  beforeEach(() => {
    menusRepository = new InMemoryMenusRepository();
    sut = new CreateMenuUseCase(menusRepository);
  });

  it("should be able to create a new menu", async () => {
    const { menu } = await sut.execute({
      menu: {},
    });

    expect(menu.id).toEqual(expect.any(String));
  })

  it("should be able to create a new menu with a specific date", async () => {
    const { menu } = await sut.execute({
      menu: {
        created_at: "2023-06-01",
      },
    });

    expect(menu.created_at).toEqual(dayjs("2023-06-01").toDate());
  })
})