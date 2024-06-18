namespace mvno_admin.Models
{
    public class Notes
    {

        public Notes(string NoteType, string NoteStatus, string AllNotes, string CreationAuthor, string CreationDatetime, string RevisionAuthor, string RevisionDatetime)
        {
            this.NoteType = NoteType;
            this.NoteStatus = NoteStatus;
            this.AllNotes = AllNotes;
            this.CreationAuthor = CreationAuthor;
            this.CreationDatetime = CreationDatetime;
            this.RevisionAuthor = RevisionAuthor;
            this.RevisionDatetime = RevisionDatetime;
        }
        public string NoteType { get; set; }
        public string NoteStatus { get; set; }
        public string AllNotes { get; set; }
        public string CreationAuthor { get; set; }
        public string CreationDatetime { get; set; }
        public string RevisionAuthor { get; set; }
        public string RevisionDatetime { get; set; }
    }
}