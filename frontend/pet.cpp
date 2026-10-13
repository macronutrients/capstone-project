#include "pet.hpp"

    Pet::Pet() : name_(""), star_unlock_(0) {}

    Pet::Pet(std::string name, int star_unlock) : name_(name), star_unlock_(star_unlock)
    {

    }

    std::string Pet::getName()
    {
        return name_;
    }

    int Pet::getStarUnlock()
    {
        return star_unlock_;
    }