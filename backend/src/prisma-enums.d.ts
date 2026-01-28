// Temporary type declarations for Prisma enums (until prisma generate works)
declare module '@prisma/client' {
  export { PrismaClient } from '.prisma/client';

  export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    TALUK_ASSOCIATION = 'TALUK_ASSOCIATION',
    ACADEMY = 'ACADEMY',
    PLAYER = 'PLAYER',
    ARBITER = 'ARBITER',
  }

  export enum UserStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    INACTIVE = 'INACTIVE',
  }

  export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
  }

  export enum OrganizationType {
    TALUK_ASSOCIATION = 'TALUK_ASSOCIATION',
    ACADEMY = 'ACADEMY',
    SCHOOL = 'SCHOOL',
    CLUB = 'CLUB',
  }

  export enum OrganizationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    SUSPENDED = 'SUSPENDED',
  }

  export enum TournamentLevel {
    TALUK = 'TALUK',
    DISTRICT = 'DISTRICT',
    STATE = 'STATE',
    NATIONAL = 'NATIONAL',
    INTERNATIONAL = 'INTERNATIONAL',
  }

  export enum TournamentStatus {
    DRAFT = 'DRAFT',
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    APPROVED = 'APPROVED',
    REGISTRATION_OPEN = 'REGISTRATION_OPEN',
    REGISTRATION_CLOSED = 'REGISTRATION_CLOSED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
  }

  export enum TournamentCategory {
    OPEN = 'OPEN',
    UNDER_7 = 'UNDER_7',
    UNDER_9 = 'UNDER_9',
    UNDER_11 = 'UNDER_11',
    UNDER_13 = 'UNDER_13',
    UNDER_15 = 'UNDER_15',
    UNDER_17 = 'UNDER_17',
    UNDER_19 = 'UNDER_19',
    VETERANS = 'VETERANS',
    WOMEN = 'WOMEN',
    SCHOOL = 'SCHOOL',
  }

  export enum TimeControl {
    CLASSICAL = 'CLASSICAL',
    RAPID = 'RAPID',
    BLITZ = 'BLITZ',
    BULLET = 'BULLET',
  }

  export enum RegistrationStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    WITHDRAWN = 'WITHDRAWN',
    NO_SHOW = 'NO_SHOW',
  }

  export enum PaymentStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
    CANCELLED = 'CANCELLED',
  }

  export enum PaymentPurpose {
    MEMBERSHIP_NEW = 'MEMBERSHIP_NEW',
    MEMBERSHIP_RENEWAL = 'MEMBERSHIP_RENEWAL',
    TOURNAMENT_REGISTRATION = 'TOURNAMENT_REGISTRATION',
    ARBITER_CERTIFICATION = 'ARBITER_CERTIFICATION',
  }

  export enum ContentType {
    NEWS = 'NEWS',
    ANNOUNCEMENT = 'ANNOUNCEMENT',
    PAGE = 'PAGE',
    BANNER = 'BANNER',
    TESTIMONIAL = 'TESTIMONIAL',
    ACHIEVEMENT = 'ACHIEVEMENT',
  }

  export enum ContentStatus {
    DRAFT = 'DRAFT',
    PENDING_REVIEW = 'PENDING_REVIEW',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
  }

  export enum MediaPurpose {
    PROFILE_PHOTO = 'PROFILE_PHOTO',
    DOCUMENT = 'DOCUMENT',
    CERTIFICATE = 'CERTIFICATE',
    TOURNAMENT_IMAGE = 'TOURNAMENT_IMAGE',
    BANNER = 'BANNER',
    GALLERY = 'GALLERY',
    LOGO = 'LOGO',
  }

  export enum OfficeBearerRole {
    PRESIDENT = 'PRESIDENT',
    VICE_PRESIDENT = 'VICE_PRESIDENT',
    SECRETARY = 'SECRETARY',
    JOINT_SECRETARY = 'JOINT_SECRETARY',
    TREASURER = 'TREASURER',
    EXECUTIVE_MEMBER = 'EXECUTIVE_MEMBER',
    HONORARY_PRESIDENT = 'HONORARY_PRESIDENT',
    PATRON = 'PATRON',
  }
}
