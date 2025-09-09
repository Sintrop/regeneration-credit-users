"use client";

import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { getUser } from "@/services/user/getUser";
import { useRouter } from "next/navigation";
import { getRegenerator } from "@/services/regenerator/getRegenerator";
import { getSupporter } from "@/services/supporter/getSupporter";

export function SearchInput() {
  const { t } = useTranslation();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const address = formData.get("address") as string;

    const userType = await getUser(address);
    if (userType.success) {
      if (userType.userType === 1) {
        const regenerator = await getRegenerator(address);
        router.push(`/regenerator/${address}/${regenerator.name}`);
      }

      if (userType.userType === 7) {
        const supporter = await getSupporter(address);
        router.push(`/supporter/${address}/${supporter.name}`);
      }
    } else {
      setErrorMessage("userNotFound");
    }
  }
  return (
    <div className="flex flex-col gap-1">
      <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
        <label htmlFor="address" className="text-gray-400">
          {t("typeAddressToSearchUser")}:
        </label>

        <div className="flex gap-5">
          <input
            name="address"
            placeholder={t("typeHere")}
            className="w-full md:w-[500px] h-12 border rounded-2xl px-5 border-gray-300"
          />

          <button
            className="w-32 h-12 rounded-2xl items-center justify-center bg-green-600 text-white font-semibold hover:cursor-pointer hover:bg-green-700 duration-200"
            type="submit"
          >
            {t("search")}
          </button>
        </div>

        {errorMessage !== "" && (
          <p className="text-red-500">{t(errorMessage)}</p>
        )}
      </form>
    </div>
  );
}
