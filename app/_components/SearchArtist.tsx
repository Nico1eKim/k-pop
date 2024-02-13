import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ArtistCard from "@/components/ArtistCard";
import ChipButton from "@/components/chip/ChipButton";
import SearchInput from "@/components/input/SearchInput";
import { Api } from "@/api/api";
import { useModal } from "@/hooks/useModal";
import { ArtistType } from "@/types/index";
import InputModal from "./modal/InputModal";

interface Props {
  onClick: (name: string, id: string, isChecked: boolean) => void;
  myArtists: string[];
  myArtistsInfo: { name: string; id: string }[];
}

const SearchArtist = ({ onClick, myArtists, myArtistsInfo }: Props) => {
  const [keyword, setKeyword] = useState("");
  const instance = new Api();

  const { data } = useQuery({
    queryKey: ["group", keyword],
    queryFn: async () => {
      return instance.get("/artist/group", { keyword: keyword, size: 12, page: 1 });
    },
  });

  console.log(data);

  const [selected, setSelected] = useState(myArtistsInfo);
  const lastButton = useRef<HTMLButtonElement>(null);

  const handleArtistClick = (name: string, isChecked: boolean, id: string) => {
    onClick(name, id, isChecked);

    setSelected((prevSelected) => {
      const isSelected = prevSelected.some((item) => item.id === id);
      if (isSelected) {
        return prevSelected.filter((item) => item.id !== id);
      } else {
        return [...prevSelected, { name, id }];
      }
    });
  };

  useEffect(() => {
    lastButton.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "end" });
  }, [selected]);

  const { modal, openModal, closeModal } = useModal();
  const { control, handleSubmit, setValue } = useForm({ defaultValues: { request: "" } });

  const notify = () =>
    toast.success("등록 요청이 제출되었습니다.", {
      position: "bottom-center",
      className: "text-16 font-600 px-28 py-16",
    });

  const onModalSubmit: SubmitHandler<{ request: string }> = ({ request }) => {
    if (request) {
      setValue("request", "");
      closeModal();
      notify();
    }
  };

  if (!data?.artistAndGroupList) return;

  const searchedData: ArtistType[] = data.artistAndGroupList;

  return (
    <div className="flex w-full flex-col pt-8">
      <button className="w-fit text-14 font-500 text-gray-400 underline" onClick={() => openModal("reqArtist")} type="button">
        찾으시는 아티스트가 없으신가요?
      </button>
      <section className="pt-24">
        <SearchInput placeholder="입력해주세요." setKeyword={setKeyword} />
      </section>
      <div className="sticky top-72 z-nav mb-16 mt-8 flex w-full gap-12 overflow-hidden bg-white-black">
        {selected.map((item, idx) => (
          <div className="mb-8 mt-8 rounded-full bg-white-black" key={idx}>
            <ChipButton
              label={item.name}
              onClick={() => handleArtistClick(item.name, !myArtists.includes(item.id), item.id)}
              ref={idx === selected.length - 1 ? lastButton : undefined}
              canDelete
            />
          </div>
        ))}
      </div>
      <ul className="flex w-full flex-wrap justify-center gap-x-16 gap-y-20 overflow-hidden px-8">
        {searchedData.map((cardList) => (
          <Card data={cardList} onClick={handleArtistClick} myArtists={myArtists} key={cardList.id} />
        ))}
      </ul>
      {modal === "reqArtist" && (
        <InputModal
          title="아티스트 등록 요청"
          btnText="요청하기"
          handleBtnClick={handleSubmit(onModalSubmit)}
          closeModal={closeModal}
          {...{ name: "request", placeholder: "찾으시는 아티스트를 알려주세요.", rules: { required: "내용을 입력하세요." }, control, noButton: true }}
        />
      )}
    </div>
  );
};

export default SearchArtist;

interface CardProps {
  data: ArtistType;
  onClick: (name: string, isChecked: boolean, id: string) => void;
  myArtists: string[];
}

const Card = ({ data, onClick, myArtists }: CardProps) => {
  const { name, image, id } = data;

  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    setIsChecked(myArtists.includes(id));
  }, [myArtists]);

  return (
    <li>
      <label htmlFor={id}>
        <ArtistCard isChecked={isChecked} profileImage={image === "http://image.co.kr" ? undefined : image} isSmall>
          {name}
        </ArtistCard>
      </label>

      <input name="myArtists" type="checkbox" id={id} onChange={() => onClick(name, !isChecked, id)} checked={isChecked} hidden />
    </li>
  );
};
