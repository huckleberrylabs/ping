/* Recall Info, Image or Video, Dev ID */
type FieldBase = {
  id: UUID.T;
  required: boolean;
  label: string; // Languages
  description: string; // Languages
};

/* 
- dropdown
- checkboxes
- select
- pictures

- could be a binary choice
*/

type Choice = {
  label: string;
  vaue: string;
};

type ChoiceField = FieldBase & {
  type: "choice-field";
  multiple: boolean;
  randomize: boolean;
  otherOption: boolean;
  style: string;
  choices: Choice[];
};

/* 
- labels if sliding scale
- steps if sliding scale
- shape if rating scale

*/
type NumberField = FieldBase & {
  type: "number-field";
  min: number;
  max: number;
  decimal: boolean;
};

type PersonNameField = FieldBase & { type: "person-name-field" };
type EmailField = FieldBase & { type: "email-field" };
type UrlField = FieldBase & { type: "url-field" };
type PhoneField = FieldBase & {
  type: "phone-field";
};

type TextField = FieldBase & {
  type: "text-field";
  maxLength: number;
  longForm: boolean;
};

type FileField = FieldBase & { type: "file-field" };

type MetaField = {
  id: UUID.T;
  required: boolean;
  type: "meta-field";
  name: string;
}; // SDK, pathname, etc;

/* 

- Statement
  - Quotation Marks
  - Button Text
- Date
  - Format
- Payment
  - Stripe Account
  - Currency
  - Amount
  - Button

*/

type Field =
  | BinaryField
  | ChoiceField
  | EmailField
  | FileField
  | UrlField
  | PersonNameField
  | TextField
  | NumberField
  | PhoneField
  | ScaleField
  | RatingField
  | MetaField;

export type Form = {
  id: UUID.T;
  fields: Field[];
};

/* non-functional

- language-text
- theme
*/
export type Theme = {
  id: UUID.T;
  font: string;
  primaryColor: Color.T;
  secondaryColor: Color.T;
  backgroundColor: Color.T;
};

/* 
- Fields are entities
- Forms are entities

create a new form
duplicate an old form
add a field to a form
update a field in a form
reorder the form fields



*/
