import Joi from "Joi";

export default {
  Person: {
    Person: {
      sameAs: {}
    },
    Organization: {
      memberOf: {
        title: Joi.string(),
        start: Joi.string().isoDate(),
        end: Joi.string().isoDate(),
        status: Joi.string().only("active", "inactive"),
        description: Joi.string(),
        barristerNumber: Joi.number(),
        hasRegulatoryProceedings: Joi.boolean(),
        hasPracticeRestrictions: Joi.boolean(),
        isRealEstateEnsured: Joi.boolean(),
        acceptsLegalAid: Joi.boolean()
      },
      employeeOf: {
        title: Joi.string(),
        start: Joi.string().isoDate(),
        end: Joi.string().isoDate(),
        status: Joi.string().only("active", "inactive"),
        description: Joi.string()
      },
      awardedBy: {
        date: Joi.string(),
        title: Joi.string(),
        description: Joi.string()
      }
    },
    Place: {},
    Email: {
      has: {
        isPrimary: Joi.boolean()
      }
    },
    Phone: {
      has: {
        isPrimary: Joi.boolean()
      }
    },
    TwitterUser: {
      has: {
        isPrimary: Joi.boolean()
      }
    },
    LinkedInUser: {
      has: {
        isPrimary: Joi.boolean()
      }
    },
    Website: {
      has: {
        isPrimary: Joi.boolean()
      }
    },
    Webpage: {
      has: {
        isPrimary: Joi.boolean()
      }
    },
    Image: {
      has: {
        isPrimary: Joi.boolean()
      }
    },
    Language: {
      speaks: {
        isPrimary: Joi.boolean()
      }
    },
    Tag: {
      taggedAs: {}
    }
  },
  Organization: {
    Organization: {
      sameAs: {}
    },
    Place: {
      has: {
        isPrimary: Joi.boolean()
      }
    },
    Email: {
      has: {
        isPrimary: Joi.boolean()
      }
    },
    Phone: {
      has: {
        isPrimary: Joi.boolean()
      }
    },
    TwitterUser: {
      has: {
        isPrimary: Joi.boolean()
      }
    },
    LinkedInCompany: {
      has: {
        isPrimary: Joi.boolean()
      }
    },
    Website: {
      has: {
        isPrimary: Joi.boolean()
      }
    },
    Webpage: {
      has: {
        isPrimary: Joi.boolean()
      }
    },
    Image: {
      has: {
        isPrimary: Joi.boolean()
      }
    },
    Language: {
      speaks: {
        isPrimary: Joi.boolean()
      }
    },
    Tag: {
      taggedAs: {}
    }
  },
  Place: {
    Email: {
      has: {
        isPrimary: Joi.boolean()
      }
    },
    Phone: {
      has: {
        isPrimary: Joi.boolean()
      }
    }
  },
  Source: {
    Place: {
      verifies: {
        timestamp: Joi.string()
      }
    },
    Email: {
      verifies: {
        timestamp: Joi.string()
      }
    },
    Phone: {
      verifies: {
        timestamp: Joi.string()
      }
    },
    TwitterUser: {
      verifies: {
        timestamp: Joi.string()
      }
    },
    LinkedInCompany: {
      verifies: {
        timestamp: Joi.string()
      }
    },
    LinkedInUser: {
      verifies: {
        timestamp: Joi.string()
      }
    },
    Website: {
      verifies: {
        timestamp: Joi.string()
      }
    },
    Webpage: {
      verifies: {
        timestamp: Joi.string()
      }
    }
  },
  Website: {
    Webpage: {
      parentOf: {}
    }
  }
};
