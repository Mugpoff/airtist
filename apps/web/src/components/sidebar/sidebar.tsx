"use client"

import { ScrollArea } from "@repo/ui/base/scroll-area"
import { useTranslations } from "next-intl"
import { SidebarDropzone } from "./sidebar-dropzone"
import { SidebarUserContent } from "./sidebar-user-content"

export const Sidebar = () => {
  const t = useTranslations()

  return (
    <div className="my-6 ml-6 flex h-auto w-(--sidebar-width) flex-col gap-4 [--sidebar-width:320px]">
      <SidebarUserContent />
      <ScrollArea className="shrink grow basis-auto" scrollFade scrollbarGutter>
        <SidebarDropzone />
        <h1>Hello from the client!</h1>
        <p>Translation:{t("validation.email.required")}</p>
        <p>1 Element in the ScrollArea</p>
        <p>2 Element in the ScrollArea</p>
        <p>3 Element in the ScrollArea</p>
        <p>4 Element in the ScrollArea</p>
        <p>5 Element in the ScrollArea</p>
        <p>6 Element in the ScrollArea</p>
        <p>7 Element in the ScrollArea</p>
        <p>8 Element in the ScrollArea</p>
        <p>9 Element in the ScrollArea</p>
        <p>10 Element in the ScrollArea</p>
        <p>11 Element in the ScrollArea</p>
        <p>12 Element in the ScrollArea</p>
        <p>13 Element in the ScrollArea</p>
        <p>14 Element in the ScrollArea</p>
        <p>15 Element in the ScrollArea</p>
        <p>16 Element in the ScrollArea</p>
        <p>17 Element in the ScrollArea</p>
        <p>18 Element in the ScrollArea</p>
        <p>19 Element in the ScrollArea</p>
        <p>20 Element in the ScrollArea</p>
        <p>21 Element in the ScrollArea</p>
        <p>22 Element in the ScrollArea</p>
        <p>23 Element in the ScrollArea</p>
        <p>24 Element in the ScrollArea</p>
        <p>25 Element in the ScrollArea</p>
        <p>26 Element in the ScrollArea</p>
        <p>27 Element in the ScrollArea</p>
        <p>28 Element in the ScrollArea</p>
        <p>29 Element in the ScrollArea</p>
        <p>30 Element in the ScrollArea</p>
        <p>31 Element in the ScrollArea</p>
        <p>32 Element in the ScrollArea</p>
        <p>33 Element in the ScrollArea</p>
        <p>34 Element in the ScrollArea</p>
        <p>35 Element in the ScrollArea</p>
        <p>36 Element in the ScrollArea</p>
        <p>37 Element in the ScrollArea</p>
        <p>38 Element in the ScrollArea</p>
        <p>39 Element in the ScrollArea</p>
        <p>40 Element in the ScrollArea</p>
        <p>41 Element in the ScrollArea</p>
        <p>42 Element in the ScrollArea</p>
        <p>43 Element in the ScrollArea</p>
        <p>44 Element in the ScrollArea</p>
        <p>45 Element in the ScrollArea</p>
        <p>46 Element in the ScrollArea</p>
        <p>47 Element in the ScrollArea</p>
        <p>48 Element in the ScrollArea</p>
        <p>49 Element in the ScrollArea</p>
        <p>50 Element in the ScrollArea</p>
      </ScrollArea>
    </div>
  )
}
