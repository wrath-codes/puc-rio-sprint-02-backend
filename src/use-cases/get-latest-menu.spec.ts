import { beforeEach, describe, expect, it } from "vitest";

import { GetLatestMenuUseCase } from "./get-latest-menu";
import { InMemoryMenusRepository } from "@/repositories/in-memory/menus-repository-in-memory";
import { MenuNotFoundError } from "./errors/menu-not-found";
import dayjs from "dayjs";

let menuRepository: InMemoryMenusRepository;
let sut: GetLatestMenuUseCase;

describe("Get Latest Menu Use Case", () => {
  beforeEach(() => {
    menuRepository = new InMemoryMenusRepository();

    sut = new GetLatestMenuUseCase(menuRepository);
  });

  it("should be able to get the latest menu", async () => {

    const menu_01 = await menuRepository.create({
      created_at: dayjs().subtract(1, "day").toDate(),
    });

    const menu_02 = await menuRepository.create({
      created_at: dayjs().toDate(),
    });

    const response = await sut.execute();

    expect(response.menu).toEqual(menu_02);
  });

  it("should not be able to get the latest menu from a non-existing menu", async () => {
    await expect(
      sut.execute(),
    ).rejects.toBeInstanceOf(MenuNotFoundError);
  });
})