"use client";

import Image from "next/image";
import { useFunnel } from "@/hooks/useFunnel";
import GenericForm from "../signup/_components/GenericForm";
import DetailInfo from "./_components/DetailInfo";
import MainInfo from "./_components/MainInfo";
import StarInfo from "./_components/StarInfo";
import SubInfo from "./_components/SubInfo";

export const POST_STEPS = ["행사 대상", "행사 정보", "특전 정보", "상세 설명"];

const DEFAULT_INPUT_VALUES = {
  eventType: "생일카페",
  title: "",
  address: "",
  detailAddress: "",
  startDate: "",
  endDate: "",
  snsId: "",
  snsType: "트위터",
  eventUrl: "",
  gift: [],
  images: [],
  detailText: "",
};

export type PostType = Omit<typeof DEFAULT_INPUT_VALUES, "gift" | "images"> & { gift: string[]; images: File[] };

const Post = () => {
  const { Funnel, Step, setStep, currentStep } = useFunnel(POST_STEPS[0]);

  return (
    <div className="flex h-svh flex-col gap-24 p-20 text-16">
      <div className="flex gap-8 pb-20 pt-12">
        <Image
          src="/icon/left-arrow.svg"
          alt="뒤로가기 버튼"
          width={24}
          height={24}
          onClick={() => (currentStep === POST_STEPS[0] ? window.history.back() : setStep(POST_STEPS[POST_STEPS.indexOf(currentStep) - 1]))}
          className="cursor-pointer"
        />
        <div className="text-20 font-900">등록하기</div>
      </div>
      <GenericForm formOptions={{ mode: "onBlur", defaultValues: DEFAULT_INPUT_VALUES, shouldFocusError: true }}>
        <Funnel>
          <Step name={POST_STEPS[0]}>
            <StarInfo onNextStep={() => setStep(POST_STEPS[1])} />
          </Step>
          <Step name={POST_STEPS[1]}>
            <MainInfo onNextStep={() => setStep(POST_STEPS[2])} />
          </Step>
          <Step name={POST_STEPS[2]}>
            <SubInfo onNextStep={() => setStep(POST_STEPS[3])} />
          </Step>
          <Step name={POST_STEPS[3]}>
            <DetailInfo />
          </Step>
        </Funnel>
      </GenericForm>
    </div>
  );
};

export default Post;
