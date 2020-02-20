export interface Label {
  id?: string;
  color: string;
  text: string;
  tags: string[];
  appendDate: firebase.firestore.Timestamp;
}
