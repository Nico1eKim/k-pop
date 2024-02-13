import { ArtistAndGroupListType, EventCardType } from ".";

type Res_Get_Event = EventCardType;
type Res_Get_Event_List = EventCardType[];
type Res_Get_Artist_Group = ArtistAndGroupListType;

export type Res_Get_Type = {
  event: Res_Get_Event;
  eventList: Res_Get_Event_List;
  artistGroup: Res_Get_Artist_Group;
};
